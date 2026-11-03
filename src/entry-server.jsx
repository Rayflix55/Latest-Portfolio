import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import App from './App.jsx';

export { routeMeta, projectsJsonLd } from './seo.js';

export function render(url) {
  return renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  );
}
