"""Local test server: serves the site the way Vite does (index.html, src/, public/) and answers
/__dev/* requests from src/backend/dev.js by running them against a local Postgres as the
signed-in user, so the real row level security rules apply. For testing only.

  python3 tests/devserver.py --db bobdev --port 8787 [--reset]

--reset recreates the database from tests/supabase_stub.sql and supabase/migrations/*.sql.
Needs psql and a Postgres on /tmp:54329 (user postgres), like tests/rls_test.py."""
import argparse, glob, json, os, re, subprocess, uuid
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser()
ap.add_argument('--db', default='bobdev'); ap.add_argument('--port', type=int, default=8787); ap.add_argument('--reset', action='store_true')
ARGS = ap.parse_args()
PSQL = ['psql', '-h', '/tmp', '-p', '54329', '-U', 'postgres', '-qtAX', '-v', 'ON_ERROR_STOP=1']

def psql(script, db=None):
    p = subprocess.run(PSQL + ['-d', db or ARGS.db, '-f', '-'], input=script, capture_output=True, text=True)
    if p.returncode:
        m = re.search(r'ERROR:\s+(.*)', p.stderr)
        raise RuntimeError(m.group(1) if m else p.stderr.strip() or 'database error')
    return p.stdout.strip()

def setvar(name, value):
    v = value.replace('\\', '\\\\').replace("'", "''")
    return f"\\set {name} '{v}'\n"

if ARGS.reset:
    psql(f'drop database if exists {ARGS.db};\ncreate database {ARGS.db};', db='postgres')
    psql(open(os.path.join(ROOT, 'tests/supabase_stub.sql')).read())
    for f in sorted(glob.glob(os.path.join(ROOT, 'supabase/migrations/*.sql'))): psql(open(f).read())
    # the lesson content and questions, as scripts/upload-content.mjs would upload them
    rows = subprocess.run(['node', os.path.join(ROOT, 'scripts/upload-content.mjs'), '--json'], capture_output=True, text=True, check=True).stdout
    psql(setvar('c', rows) + """with C as (select :'c'::jsonb j),
      a as (insert into public.lesson_theory (id, ord, free, html) select id, ord, free, html from jsonb_populate_recordset(null::public.lesson_theory, (select j->'theory' from C)) returning 1),
      b as (insert into public.exam_papers (id, ord, data) select id, ord, data from jsonb_populate_recordset(null::public.exam_papers, (select j->'papers' from C)) returning 1),
      q as (insert into public.exam_questions (id, ord, free, data) select id, ord, free, data from jsonb_populate_recordset(null::public.exam_questions, (select j->'questions' from C)) returning 1)
      update public.site_settings set content_version = (select count(*) from a) || '-' || (select count(*) from b) || '-' || (select count(*) from q) || '-' || now();""")
psql('create table if not exists auth.dev_pw (id uuid primary key, pw text not null);')

TABLES = set(psql("select string_agg(tablename, ',') from pg_tables where schemaname = 'public'").split(','))
IDENT = re.compile(r'^[a-z_][a-z0-9_]*$')
RPC = {  # name: (kind, [(arg, type)])
    'join_class': ('scalar', [('code', 'text')]), 'accept_invite': ('scalar', [('c', 'uuid')]),
    'new_join_code': ('scalar', [('c', 'uuid')]), 'decide_licence_request': ('void', [('r', 'uuid'), ('approve', 'boolean')]),
    'licence_counts': ('set', [('t', 'uuid')]),
    'claim_teacher': ('scalar', []),
    'my_access': ('scalar', []),
    'course_content': ('scalar', [('have', 'text')]),
    'reassign': ('scalar', [('a', 'uuid'), ('students', 'uuid[]'), ('due', 'date'), ('note', 'text'), ('prev', 'jsonb')]),
}
def argsql(a, ty):
    if ty == 'uuid[]': return f"array(select jsonb_array_elements_text((select j from P)->'args'->'{a}'))::uuid[]"
    if ty == 'jsonb': return f"((select j from P)->'args'->'{a}')"
    return f"((select j from P)->'args'->>'{a}')::{ty}"

def ident(x):
    if not IDENT.match(x or ''): raise RuntimeError('bad name ' + repr(x))
    return x

def where(b):
    conds = [f"to_jsonb(t.{ident(k)}) = (select j from P)->'eq'->'{k}'" for k in (b.get('eq') or {})]
    conds += [f"to_jsonb(t.{ident(k)}) in (select jsonb_array_elements((select j from P)->'in'->'{k}'))" for k in (b.get('in') or {})]
    return ' and '.join(conds) or 'true'

def run_as(uid, payload, sql):
    pre = setvar('p', json.dumps(payload)) + setvar('uid', uid or '')
    if uid: pre += "set role authenticated;\nselect set_config('request.jwt.claim.sub', :'uid', false) \\g /dev/null\n"
    else: pre += 'set role anon;\n'
    out = psql(pre + 'with P as (select :\'p\'::jsonb j) ' + sql + ';')
    return json.loads(out) if out else None

def db_op(uid, b):
    t = ident(b['table'])
    if t not in TABLES: raise RuntimeError('unknown table ' + t)
    op = b['op']
    if op == 'select':
        order = ', '.join(f"t.{ident(c[0])} {'desc' if len(c) > 1 and c[1] == 'desc' else 'asc'}" for c in (b.get('order') or []))
        return run_as(uid, b, f"select coalesce(jsonb_agg(to_jsonb(t){' order by ' + order if order else ''}), '[]') from public.{t} t where {where(b)}")
    if op in ('insert', 'upsert'):
        rows = b['rows']
        if not rows: return []
        cols = sorted({ident(k) for r in rows for k in r})
        cl = ', '.join(cols)
        conflict = ''
        if op == 'upsert':
            oc = ', '.join(ident(c.strip()) for c in b['onConflict'].split(','))
            conflict = f" on conflict ({oc}) do update set " + ', '.join(f'{c} = excluded.{c}' for c in cols)
        return run_as(uid, b, f", ins as (insert into public.{t} ({cl}) select {cl} from jsonb_populate_recordset(null::public.{t}, (select j from P)->'rows'){conflict} returning *) select coalesce(jsonb_agg(to_jsonb(ins)), '[]') from ins")
    if op == 'update':
        cols = [ident(k) for k in b['values']]
        cl = ', '.join(cols)
        run_as(uid, b, f", u as (update public.{t} t set ({cl}) = (select {cl} from jsonb_populate_record(null::public.{t}, (select j from P)->'values')) where {where(b)} returning 1) select count(*) from u")
        return None
    if op == 'delete':
        if not (b.get('eq') or b.get('in')): raise RuntimeError('delete needs a filter')
        run_as(uid, b, f", d as (delete from public.{t} t where {where(b)} returning 1) select count(*) from d")
        return None
    raise RuntimeError('bad op')

def rpc(uid, b):
    fn = b['fn']
    if fn not in RPC: raise RuntimeError('unknown function ' + fn)
    kind, params = RPC[fn]
    args = ', '.join(f"{a} => {argsql(a, ty)}" for a, ty in params if a in (b.get('args') or {}))
    call = f'public.{fn}({args})'
    if kind == 'set': return run_as(uid, b, f"select coalesce(jsonb_agg(to_jsonb(r)), '[]') from {call} r")
    if kind == 'void': run_as(uid, b, f'select 1 from (select {call}) x'); return None
    return run_as(uid, b, f'select to_jsonb({call})')

def admin_sql(payload, sql):
    out = psql(setvar('p', json.dumps(payload)) + 'with P as (select :\'p\'::jsonb j) ' + sql + ';')
    return json.loads(out) if out else None

def auth(path, uid, b):
    if path == 'signup':
        email = b['email'].strip().lower()
        if admin_sql(b, f"select to_jsonb(exists(select 1 from auth.users where lower(email) = lower((select j from P)->>'email')))"):
            raise RuntimeError('User already registered')
        i = str(uuid.uuid4())
        admin_sql({'id': i, 'email': email, 'meta': b.get('meta') or {}, 'pw': b['password']},
            ", a as (insert into auth.users (id, email, raw_user_meta_data) select ((select j from P)->>'id')::uuid, (select j from P)->>'email', (select j from P)->'meta' returning id)"
            ", b as (insert into auth.dev_pw select a.id, (select j from P)->>'pw' from a returning 1) select to_jsonb(count(*)) from b")
        return {'id': i, 'email': email}
    if path == 'signin':
        r = admin_sql(b, "select to_jsonb(x) from (select u.id, u.email from auth.users u join auth.dev_pw p on p.id = u.id "
                         "where lower(u.email) = lower((select j from P)->>'email') and p.pw = (select j from P)->>'password') x")
        if not r: raise RuntimeError('Invalid login credentials')
        return r
    if path == 'password':
        if not uid: raise RuntimeError('Sign in first.')
        admin_sql({'id': uid, 'pw': b['password']}, "update auth.dev_pw set pw = (select j from P)->>'pw' where id = ((select j from P)->>'id')::uuid returning 1")
        return None
    raise RuntimeError('bad path')

class H(SimpleHTTPRequestHandler):
    def __init__(self, *a, **k): super().__init__(*a, directory=ROOT, **k)
    def log_message(self, *a): pass
    def translate_path(self, path):
        p = path.split('?', 1)[0].split('#', 1)[0]
        if p.startswith('/app/'): return os.path.join(ROOT, 'public', p.lstrip('/'))
        return super().translate_path(path)
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store'); super().end_headers()
    def reply(self, code, obj):
        body = json.dumps(obj).encode()
        self.send_response(code); self.send_header('content-type', 'application/json'); self.send_header('content-length', str(len(body))); self.end_headers(); self.wfile.write(body)
    def do_GET(self):
        if self.path.startswith('/__dev/ping'): return self.reply(200, {'ok': True})
        return super().do_GET()
    def do_POST(self):
        if not self.path.startswith('/__dev/'): return self.reply(404, {'error': 'not found'})
        path = self.path[len('/__dev/'):].split('?')[0]
        b = json.loads(self.rfile.read(int(self.headers.get('content-length') or 0)) or b'{}')
        uid = self.headers.get('x-user') or None
        try:
            if uid and not re.match(r'^[0-9a-f-]{36}$', uid): raise RuntimeError('bad user')
            data = db_op(uid, b) if path == 'db' else rpc(uid, b) if path == 'rpc' else auth(path, uid, b)
            self.reply(200, {'data': data})
        except Exception as e:
            self.reply(400, {'error': str(e)})

print(f'dev server on http://localhost:{ARGS.port} using database {ARGS.db}', flush=True)
ThreadingHTTPServer(('127.0.0.1', ARGS.port), H).serve_forever()
