"""Record a step-by-step trace of a short Python program for the A-Level 'trace' widget.
Reads code on stdin, prints JSON steps: [{e: line|return|end, line, stack:[{fn, loc}], out, ret}]."""
import sys, io, json, contextlib
code = sys.stdin.read()
steps, out = [], io.StringIO()
def snap(frame):
    st, f = [], frame
    while f is not None and f.f_code.co_filename == '<trace>':
        loc = {k: repr(v) for k, v in f.f_locals.items()
               if not k.startswith('__') and not callable(v) and type(v).__name__ != 'module'}
        st.append({'fn': f.f_code.co_name, 'loc': loc})
        f = f.f_back
    return st[::-1]
def tracer(frame, event, arg):
    if frame.f_code.co_filename != '<trace>':
        return tracer
    if event in ('line', 'return'):
        if event == 'return' and frame.f_code.co_name == '<module>':
            return tracer
        steps.append({'e': event, 'line': frame.f_lineno, 'stack': snap(frame), 'out': out.getvalue(),
                      'ret': repr(arg) if event == 'return' else None})
        if len(steps) > 600:
            raise RuntimeError('too many steps (over 600): make the example shorter')
    return tracer
g = {'__name__': '__main__'}
with contextlib.redirect_stdout(out):
    sys.settrace(tracer)
    try:
        exec(compile(code, '<trace>', 'exec'), g)
    finally:
        sys.settrace(None)
steps.append({'e': 'end', 'line': None, 'stack': [], 'out': out.getvalue(), 'ret': None})
print(json.dumps(steps, separators=(',', ':')))
