import { defineConfig } from 'vite';

export default defineConfig({
  // a fresh value on every build, added to the site's own script and content URLs so browsers fetch new versions
  define: { __BUILD__: JSON.stringify(Date.now().toString(36)) },
  build: { target: 'es2020' },
});
