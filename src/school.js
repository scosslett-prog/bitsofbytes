/* School data: classes, licences, invitations, assignments and marks.
   load() fills the SC cache that the teacher and student pages draw from (public/app/04-school.js).
   Every change goes to the database first; the page then reloads the cache and redraws.
   Row level security decides what each account can see, so a teacher only ever receives
   their own classes and students, and a student only their own class. */

const ms = (t) => (t ? Date.parse(t) : 0);

export function createSchool(api, getUser) {
  const SC = { users: {}, classes: {}, lic: {}, asg: {}, subs: {}, tmarks: {}, seen: [], prog: {}, progLast: {}, admin: null };
  const db = api && api.db;

  /* select rows whose column is in a (possibly long) list of ids, a few dozen at a time */
  async function selIn(table, col, ids, o = {}) {
    const out = [];
    for (let i = 0; i < ids.length; i += 60) out.push(...await db.select(table, { ...o, in: { [col]: ids.slice(i, i + 60) } }));
    return out;
  }
  const person = (p) => ({ id: p.id, name: p.full_name || (p.email || 'Student').split('@')[0], email: p.email || '', role: p.role, school: p.school || '', cls: null });

  async function load() {
    const u = getUser();
    const users = {}, classes = {}, asg = {}, subs = {}, tmarks = {}, lic = {};
    let seen = [];
    if (!u || !db) { Object.assign(SC, { users, classes, asg, subs, tmarks, lic, seen }); return; }
    users[u.id] = { id: u.id, name: u.name, email: u.email, role: u.role, school: u.school, cls: null };
    const teach = u.role === 'teacher' || u.role === 'admin';
    let cls, mem, inv;
    if (teach) {
      cls = await db.select('classes', { eq: { teacher_id: u.id }, order: [['created_at']] });
      const ids = cls.map((c) => c.id);
      [mem, inv] = ids.length ? await Promise.all([selIn('class_members', 'class_id', ids), selIn('class_invites', 'class_id', ids)]) : [[], []];
    } else {
      [mem, inv] = await Promise.all([db.select('class_members', { eq: { student_id: u.id } }), db.select('class_invites', { eq: { email: u.email } })]);
      const ids = [...new Set([...mem.map((m) => m.class_id), ...inv.map((i) => i.class_id)])];
      cls = ids.length ? await selIn('classes', 'id', ids) : [];
    }
    for (const c of cls) classes[c.id] = { id: c.id, name: c.name, teacher: c.teacher_id, code: c.join_code, students: [], invites: [], created: ms(c.created_at) };
    for (const m of mem) { const c = classes[m.class_id]; if (c && !c.students.includes(m.student_id)) c.students.push(m.student_id); }
    for (const i of inv) { const c = classes[i.class_id]; if (c && !c.invites.includes(i.email)) c.invites.push(i.email); }
    if (!teach) { const m = mem[0]; if (m && classes[m.class_id]) users[u.id].cls = m.class_id; }

    const pids = teach ? [...new Set(mem.map((m) => m.student_id))] : [...new Set(cls.map((c) => c.teacher_id))];
    if (pids.length) for (const p of await selIn('profiles', 'id', pids)) if (p.id !== u.id) users[p.id] = person(p);
    if (teach) for (const m of mem) if (users[m.student_id]) users[m.student_id].cls = m.class_id;

    const asgCls = teach ? Object.keys(classes) : users[u.id].cls ? [users[u.id].cls] : [];
    const as = asgCls.length ? await selIn('assignments', 'class_id', asgCls) : [];
    for (const a of as) asg[a.id] = { id: a.id, kind: a.kind, cls: a.class_id, title: a.title, note: a.note || '', lessons: a.lesson_ids || [], qids: a.question_ids || [],
      mode: a.mode || 'all', due: a.due_date, set: ms(a.created_at), by: a.teacher_id, spec: a.spec || {} };
    const aids = Object.keys(asg);
    if (aids.length) {
      const [sb, tm, sn] = await Promise.all([
        teach ? selIn('assignment_submissions', 'assignment_id', aids) : db.select('assignment_submissions', { eq: { student_id: u.id } }),
        teach ? selIn('teacher_marks', 'assignment_id', aids) : db.select('teacher_marks', { eq: { student_id: u.id } }),
        teach ? Promise.resolve([]) : db.select('assignment_seen', { eq: { student_id: u.id } }),
      ]);
      for (const s of sb) (subs[s.assignment_id] = subs[s.assignment_id] || {})[s.student_id] = { ans: s.answers || {}, done: s.done, date: ms(s.submitted_at) };
      for (const t of tm) { const A = (tmarks[t.assignment_id] = tmarks[t.assignment_id] || {}); (A[t.student_id] = A[t.student_id] || {})[t.question_id] = t.mark; }
      seen = sn.map((x) => x.assignment_id);
    }
    if (teach) {
      const [lc, g, rq] = await Promise.all([
        db.rpc('licence_counts', {}),
        db.select('licence_grants', { eq: { teacher_id: u.id }, order: [['created_at']] }),
        db.select('licence_requests', { eq: { teacher_id: u.id }, order: [['created_at', 'desc']] }),
      ]);
      const c = (Array.isArray(lc) ? lc[0] : lc) || { total: 0, used: 0 };
      lic[u.id] = { bought: c.total, used: c.used, hist: g.map((x) => ({ n: x.quantity, date: ms(x.created_at), note: x.note })),
        req: rq.map((r) => ({ id: r.id, n: r.quantity, status: r.status, date: ms(r.created_at), msg: r.message })) };
    }
    Object.assign(SC, { users, classes, asg, subs, tmarks, lic, seen });
  }

  /* students' lesson progress, fetched when a teacher opens a class (it can be a lot of rows) */
  const progLoading = new Set();
  async function ensureProg(ids) {
    const need = ids.filter((id) => !(id in SC.prog) && !progLoading.has(id));
    if (!need.length) return false;
    need.forEach((id) => progLoading.add(id));
    try {
      const rows = await selIn('user_progress', 'user_id', need, { select: 'user_id,kind,key,data,updated_at', order: [['user_id'], ['kind'], ['key']] });
      const P = {}, last = {};
      for (const id of need) { P[id] = { lessons: {}, scores: {}, acts: {}, ex: {} }; last[id] = 0; }
      for (const r of rows) { if (P[r.user_id][r.kind]) P[r.user_id][r.kind][r.key] = r.data; last[r.user_id] = Math.max(last[r.user_id], ms(r.updated_at)); }
      Object.assign(SC.prog, P); Object.assign(SC.progLast, last);
    } finally { need.forEach((id) => progLoading.delete(id)); }
    return true;
  }
  const progPending = (ids) => ids.some((id) => !(id in SC.prog));

  const me = () => getUser().id;
  const A = {
    joinCode: (code) => db.rpc('join_class', { code }),
    acceptInvite: (c) => db.rpc('accept_invite', { c }),
    declineInvite: (c) => db.delete('class_invites', { eq: { class_id: c, email: getUser().email } }),
    leaveClass: (c) => db.delete('class_members', { eq: { class_id: c, student_id: me() } }),
    newCode: (c) => db.rpc('new_join_code', { c }),
    createClass: async (name) => (await db.insert('classes', [{ teacher_id: me(), name }]))[0].id,
    renameClass: (c, name) => db.update('classes', { name }, { eq: { id: c } }),
    deleteClass: (c) => db.delete('classes', { eq: { id: c } }),
    invite: (c, emails) => (emails.length ? db.insert('class_invites', emails.map((email) => ({ class_id: c, email }))) : null),
    uninvite: (c, email) => db.delete('class_invites', { eq: { class_id: c, email } }),
    removeStudent: (c, s) => db.delete('class_members', { eq: { class_id: c, student_id: s } }),
    requestLicences: (n, message) => db.insert('licence_requests', [{ teacher_id: me(), quantity: n, message }]),
    createAssignment: async (a) => (await db.insert('assignments', [{ class_id: a.cls, teacher_id: me(), kind: a.kind, title: a.title, note: a.note,
      due_date: a.due, mode: a.kind === 'lessons' ? a.mode : null, lesson_ids: a.lessons || [], question_ids: a.qids || [], spec: a.spec || null }]))[0].id,
    deleteAssignment: (id) => db.delete('assignments', { eq: { id } }),
    markSeen: (aids) => (aids.length ? db.upsert('assignment_seen', aids.map((assignment_id) => ({ assignment_id, student_id: me() })), 'assignment_id,student_id') : null),
    setMark: (aid, sid, qid, v) => (v == null
      ? db.delete('teacher_marks', { eq: { assignment_id: aid, student_id: sid, question_id: qid } })
      : db.upsert('teacher_marks', [{ assignment_id: aid, student_id: sid, question_id: qid, mark: v, updated_at: new Date().toISOString() }], 'assignment_id,student_id,question_id')),
  };

  /* admin: licence requests from every teacher, and giving licences by hand */
  const admin = {
    async load() {
      const [rq, teachers] = await Promise.all([
        db.select('licence_requests', { order: [['created_at', 'desc']] }),
        db.select('profiles', { in: { role: ['teacher', 'admin'] }, order: [['created_at']] }),
      ]);
      const counts = await Promise.all(teachers.map((t) => db.rpc('licence_counts', { t: t.id }).then((r) => (Array.isArray(r) ? r[0] : r))));
      SC.admin = {
        req: rq.map((r) => ({ id: r.id, teacher: r.teacher_id, n: r.quantity, msg: r.message, status: r.status, date: ms(r.created_at), decided: ms(r.decided_at) })),
        teachers: teachers.map((t, i) => Object.assign(person(t), { total: counts[i] ? counts[i].total : 0, used: counts[i] ? counts[i].used : 0 })),
      };
    },
    decide: (r, approve) => db.rpc('decide_licence_request', { r, approve }),
    async grant(email, n, note) {
      const t = (await db.select('profiles', { eq: { email: email.toLowerCase() } }))[0];
      if (!t) throw new Error('No account has that email address.');
      if (t.role === 'student') throw new Error('That account is a student account. Licences can only be given to teachers.');
      await db.insert('licence_grants', [{ teacher_id: t.id, quantity: n, note, created_by: me() }]);
    },
  };

  return { SC, load, ensureProg, progPending, A, admin };
}
