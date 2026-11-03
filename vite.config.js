import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// `vite preview` falls back to the root index.html for extensionless URLs. Static hosts
// (Vercel, Netlify, Cloudflare Pages) serve /projects from dist/projects/index.html, so
// mirror that locally to keep the prerendered HTML and hydration honest.
const prerenderedRoutes = () => ({
  name: 'prerendered-routes',
  configurePreviewServer(server) {
    server.middlewares.use((req, _res, next) => {
      if (req.url === '/projects') req.url = '/projects/';
      next();
    });
  }
});

export default defineConfig({
  plugins: [react(), tailwindcss(), prerenderedRoutes()],
  build: {
    // ogl + the WebGL shaders live in their own lazy chunk (see Background.jsx); the rest is React itself
    chunkSizeWarningLimit: 300
  }
});
