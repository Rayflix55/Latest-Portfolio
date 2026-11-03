// Prerenders every route into static HTML at build time so crawlers and social-card
// scrapers get real content, with per-page <title>/<meta>/canonical/JSON-LD.
// Also writes sitemap.xml and robots.txt.
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { loadEnv } from 'vite';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const serverDir = path.join(root, 'dist-server');

const { VITE_SITE_URL: siteUrl = 'http://localhost:4173' } = loadEnv('production', root, 'VITE_');
const site = siteUrl.replace(/\/$/, '');

const { render, routeMeta, projectsJsonLd } = await import(pathToFileURL(path.join(serverDir, 'entry-server.js')).href);
const template = await readFile(path.join(dist, 'index.html'), 'utf8');
if (!template.includes('<!--app-html-->')) throw new Error('index.html is missing the <!--app-html--> marker');

const esc = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function withMeta(html, route) {
  const { title, description } = routeMeta[route];
  const url = route === '/' ? `${site}/` : `${site}${route}`;
  const swap = (re, to) => {
    if (!re.test(html)) throw new Error(`prerender: pattern not found ${re}`);
    html = html.replace(re, to);
  };
  const tag = (kind, name) => new RegExp(`(<meta\\s+${kind}="${name}"\\s+content=")[^"]*(")`);
  swap(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`);
  swap(tag('name', 'description'), `$1${esc(description)}$2`);
  swap(/(<link\s+rel="canonical"\s+href=")[^"]*(")/, `$1${url}$2`);
  swap(tag('property', 'og:url'), `$1${url}$2`);
  swap(tag('property', 'og:title'), `$1${esc(title)}$2`);
  swap(tag('property', 'og:description'), `$1${esc(description)}$2`);
  swap(tag('name', 'twitter:title'), `$1${esc(title)}$2`);
  swap(tag('name', 'twitter:description'), `$1${esc(description)}$2`);
  if (route === '/projects') {
    const ld = `<script type="application/ld+json">${JSON.stringify(projectsJsonLd(site))}</script>`;
    html = html.replace('</head>', `    ${ld}\n  </head>`);
  }
  return html;
}

for (const route of Object.keys(routeMeta)) {
  const html = withMeta(template, route).replace('<!--app-html-->', render(route));
  const file = route === '/' ? path.join(dist, 'index.html') : path.join(dist, route.slice(1), 'index.html');
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, html);
  console.log(`Prerendered ${route} -> ${path.relative(root, file)}`);
}

const today = new Date().toISOString().slice(0, 10);
const urls = Object.keys(routeMeta).map(
  route => `  <url>
    <loc>${site}${route === '/' ? '/' : route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`
);
await writeFile(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
);
await writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`);
await rm(serverDir, { recursive: true, force: true });
