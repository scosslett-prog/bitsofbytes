import { defineConfig } from 'vite';
import fs from 'node:fs';

/* npm run dev only: lets the Admin page's "Upload content" read content/theory.html and
   content/exams.json straight from this folder. Nothing in content/ is published with the site. */
const contentForAdmin = {
  name: 'content-for-admin',
  configureServer(server) {
    server.middlewares.use('/__content/', (req, res) => {
      const name = (req.url || '').replace(/^\//, '').split('?')[0];
      const ok = ['theory.html', 'exams.json', 'al/content.js', 'al/pairs.js', 'al/theory.html', 'al/exams.json'];
      if (!ok.includes(name)) { res.statusCode = 404; return res.end(); }
      res.setHeader('content-type', 'text/plain; charset=utf-8');
      res.end(fs.readFileSync(new URL('./content/' + name, import.meta.url)));
    });
  },
};

export default defineConfig({
  // a fresh value on every build, added to the site's own script and content URLs so browsers fetch new versions
  define: { __BUILD__: JSON.stringify(Date.now().toString(36)) },
  build: { target: 'es2020' },
  plugins: [contentForAdmin],
});
