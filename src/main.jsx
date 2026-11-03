import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import '@fontsource-variable/inter';
import '@fontsource-variable/bricolage-grotesque';
import '@fontsource-variable/jetbrains-mono';
import './index.css';
import App from './App.jsx';

const rootEl = document.getElementById('root');
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// In production the HTML is prerendered, so hydrate it. In `vite dev` the root is empty.
if (rootEl.firstElementChild) {
  hydrateRoot(rootEl, app);
} else {
  createRoot(rootEl).render(app);
}
