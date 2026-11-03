import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { mkdtemp, readdir, writeFile, rm } from 'node:fs/promises';
import sharp from 'sharp';
import { orderProjects } from '../src/utils/orderProjects.js';
import { cleanupImages, extractOgImage, extractReadmeImages, findImage, gatedHosts, processImage, sync, syncStarred } from './lib/github-sync.mjs';

const png = (w, h, color) => sharp({ create: { width: w, height: h, channels: 3, background: color } }).png().toBuffer();

// ---------- parsers ----------

test('README: prefers screenshots, drops badges/svg/logos, resolves relative + blob URLs', () => {
  const md = `
[![Build](https://img.shields.io/badge/build-passing-green)](x)
![logo](./assets/logo.png)
<img src="https://example.com/diagram.svg" alt="diagram">
![Screenshot of the dashboard](docs/dashboard.png)
![other](https://github.com/o/r/blob/main/shots/home.png)
`;
  const urls = extractReadmeImages(md, { owner: 'o', repo: 'r', branch: 'main' });
  assert.equal(urls[0], 'https://raw.githubusercontent.com/o/r/main/docs/dashboard.png');
  assert.ok(urls.includes('https://raw.githubusercontent.com/o/r/main/shots/home.png'));
  assert.ok(!urls.some(u => /shields|\.svg/.test(u)));
  assert.equal(urls.at(-1), 'https://raw.githubusercontent.com/o/r/main/assets/logo.png'); // logos rank last
});

test('OG: any attribute order, falls back to twitter:image, resolves relative URLs', () => {
  assert.equal(extractOgImage('<meta content="/img/og.png" property="og:image">', 'https://site.dev/a/'), 'https://site.dev/img/og.png');
  assert.equal(extractOgImage('<meta name="twitter:image" content="https://cdn.x/y.jpg">', 'https://site.dev'), 'https://cdn.x/y.jpg');
  assert.equal(extractOgImage('<meta property="og:title" content="hi">', 'https://site.dev'), null);
});

// ---------- image pipeline ----------

test('processImage: validates and emits only the sizes the source can support', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'img-'));
  assert.deepEqual(await processImage(await png(1000, 600, '#335'), 'a', dir), [640, 1024]);
  assert.deepEqual(await processImage(await png(2000, 1100, '#533'), 'b', dir), [640, 1024, 1884]);
  assert.deepEqual((await readdir(dir)).sort(), ['a-1024.webp', 'a-640.webp', 'b-1024.webp', 'b-640.webp', 'b.webp']);
  await assert.rejects(processImage(await png(120, 120, '#000'), 'c', dir), /too small/);
  await assert.rejects(processImage(await png(400, 1800, '#000'), 'd', dir), /aspect/);
  await rm(dir, { recursive: true });
});

// ---------- end-to-end against a mock GitHub ----------

test('sync: filters repos, picks sources, reuses cache, cleans stale files', async () => {
  const hits = {};
  const good = await png(1600, 900, '#2a6');
  const tiny = await png(100, 100, '#fff');
  let base = '';
  const repo = (name, extra = {}) => ({
    name, html_url: `https://github.com/u/${name}`, owner: { login: 'u' }, default_branch: 'main', homepage: '', description: `${name} desc`,
    topics: ['reactjs', 'tailwindcss'], language: 'TypeScript', fork: false, archived: false, private: false,
    created_at: '2025-03-01T00:00:00Z', pushed_at: '2026-01-01T00:00:00Z', stargazers_count: 2, ...extra
  });
  const server = http.createServer((req, res) => {
    hits[req.url] = (hits[req.url] ?? 0) + 1;
    const send = (type, body, code = 200) => (res.writeHead(code, { 'content-type': type }), res.end(body));
    const url = req.url.split('?')[0];
    if (url === '/users/u/repos') {
      return send('application/json', JSON.stringify([
        repo('readme-shot'),
        repo('live-og', { homepage: `${base}/site-og/` }),
        repo('bad-og', { homepage: `${base}/site-bad/` }),
        repo('plain-lib'),
        repo('a-fork', { fork: true, homepage: `${base}/site-og/` }),
        repo('old-archived', { archived: true, homepage: `${base}/site-og/` }),
        repo('hidden-one', { homepage: `${base}/site-og/` })
      ]));
    }
    if (url === '/u/readme-shot/main/README.md') return send('text/plain', '# x\n![Screenshot](shot.png)\n');
    if (url === '/u/readme-shot/main/shot.png') return send('image/png', good);
    if (url.endsWith('/README.md')) return send('text/plain', '# no images here');
    if (url === '/site-og/') return send('text/html', `<meta property="og:image" content="/og.png">`);
    if (url === '/og.png') return send('image/png', good);
    if (url === '/site-bad/') return send('text/html', `<meta property="og:image" content="/tiny.png">`);
    if (url === '/tiny.png') return send('image/png', tiny);
    send('text/plain', 'nope', 404);
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${server.address().port}`;
  process.env.GITHUB_API_URL = base;
  process.env.GITHUB_RAW_URL = base;

  const dir = await mkdtemp(path.join(os.tmpdir(), 'sync-'));
  await writeFile(path.join(dir, 'gone-repo-640.webp'), 'stale'); // belongs to a repo no longer listed
  const config = { username: 'u', imagePriority: ['readme', 'og'], screenshot: { enabled: false }, overrides: { 'hidden-one': { hidden: true } } };
  const log = () => {};

  const first = await sync({ config, imageDir: dir, log });
  await cleanupImages(dir, first);
  assert.deepEqual(first.map(p => p.repo).sort(), ['bad-og', 'live-og', 'readme-shot']);
  const by = Object.fromEntries(first.map(p => [p.repo, p]));
  assert.equal(by['readme-shot'].imageSource, 'readme');
  assert.equal(by['readme-shot'].liveLink, '');
  assert.equal(by['live-og'].imageSource, 'og');
  assert.equal(by['live-og'].liveLink, `${base}/site-og/`);
  assert.equal(by['bad-og'].image, null); // has a live site, so it is listed, just without an image
  assert.deepEqual(by['live-og'].tech, ['React', 'Tailwind CSS']);
  assert.equal(by['live-og'].year, '2025');
  assert.equal(by['live-og'].title, 'Live Og');
  const files = await readdir(dir);
  assert.ok(files.includes('readme-shot-1024.webp') && files.includes('live-og-640.webp'));
  assert.ok(!files.includes('gone-repo-640.webp'), 'stale image removed');

  // second run with unchanged repos: images reused, no re-download
  const before = hits['/og.png'];
  const second = await sync({ config, previous: first, imageDir: dir, log });
  assert.equal(hits['/og.png'], before);
  assert.deepEqual(second.map(p => p.repo).sort(), ['bad-og', 'live-og', 'readme-shot']);

  server.close();
  await rm(dir, { recursive: true });
});

test('sync: private projects lead the list without publishing source URLs or Website fields', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'private-sync-'));
  const repo = (name, extra = {}) => ({
    name,
    html_url: `https://github.com/u/${name}`,
    owner: { login: 'u' },
    default_branch: 'main',
    homepage: 'https://internal.example',
    description: `${name} description`,
    topics: ['reactjs'],
    language: 'TypeScript',
    fork: false,
    archived: false,
    private: true,
    created_at: '2025-03-01T00:00:00Z',
    pushed_at: '2026-01-01T00:00:00Z',
    ...extra
  });
  const projects = await sync({
    config: { includePrivate: true, imagePriority: [], overrides: {}, screenshot: { enabled: false } },
    repos: [
      repo('older-private', { pushed_at: '2025-01-01T00:00:00Z' }),
      repo('newer-private'),
      repo('public-project', { private: false })
    ],
    imageDir: dir,
    token: 'test-token',
    log: () => {}
  });

  assert.deepEqual(projects.map(project => project.repo), ['newer-private', 'older-private', 'public-project']);
  assert.equal(projects[0].private, true);
  assert.equal(projects[0].githubLink, '');
  assert.equal(projects[0].liveLink, '');
  assert.equal(projects[0].category, 'newer-private description');
  assert.equal(projects[0].image, null);
  await rm(dir, { recursive: true });
});

// ---------- starred repos ----------

test('starred: skips own repos, uses only real previews, respects limits, caches', async () => {
  const hits = {};
  const good = await png(1600, 900, '#a62');
  let base = '';
  const star = (owner, name, extra = {}) => ({
    name, full_name: `${owner}/${name}`, html_url: `https://github.com/${owner}/${name}`, owner: { login: owner }, default_branch: 'main',
    homepage: '', description: `${name} is neat`, topics: ['vuejs'], language: 'Vue', archived: false, private: false,
    pushed_at: '2026-02-02T00:00:00Z', stargazers_count: 1234, ...extra
  });
  const server = http.createServer((req, res) => {
    hits[req.url] = (hits[req.url] ?? 0) + 1;
    const send = (type, body, code = 200) => (res.writeHead(code, { 'content-type': type }), res.end(body));
    const url = req.url.split('?')[0];
    if (url === '/users/u/starred') {
      return send('application/json', JSON.stringify([
        star('u', 'my-own-repo'), // starred my own repo: already a project, must not repeat
        star('alice', 'pretty-ui'),
        star('bob', 'no-preview'),
        star('carol', 'old-stuff', { archived: true }),
        star('dave', 'hidden-by-config'),
        star('erin', 'extra-one'),
        star('frank', 'over-the-limit')
      ]));
    }
    if (url === '/alice/pretty-ui/main/README.md') return send('text/plain', '![Preview](preview.png)');
    if (url === '/alice/pretty-ui/main/preview.png') return send('image/png', good);
    if (url.endsWith('/README.md')) return send('text/plain', 'no pictures');
    send('text/plain', 'nope', 404);
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${server.address().port}`;
  process.env.GITHUB_API_URL = base;
  process.env.GITHUB_RAW_URL = base;

  const dir = await mkdtemp(path.join(os.tmpdir(), 'star-'));
  const config = { username: 'u', starred: { maxProjects: 3, exclude: ['dave/hidden-by-config'], imagePriority: ['readme', 'og'] } };
  const log = () => {};

  const first = await syncStarred({ config, imageDir: dir, log });
  assert.deepEqual(first.map(p => p.repo), ['alice/pretty-ui', 'bob/no-preview', 'erin/extra-one']); // order kept, limit 3
  assert.equal(first[0].image, '/projects/auto/star-alice-pretty-ui');
  assert.equal(first[0].imageSource, 'readme');
  assert.deepEqual(first[0].tech, ['Vue']);
  assert.equal(first[0].stars, 1234);
  assert.equal(first[1].image, null); // no preview -> listed without one, never a generic placeholder image
  assert.ok((await readdir(dir)).includes('star-alice-pretty-ui-640.webp'));

  // cached on the second run: README not fetched again for unchanged repos
  const before = hits['/alice/pretty-ui/main/README.md'];
  const second = await syncStarred({ config, previous: first, imageDir: dir, log });
  assert.equal(hits['/alice/pretty-ui/main/README.md'], before);
  assert.deepEqual(second.map(p => p.image), first.map(p => p.image));

  // can be switched off entirely
  assert.deepEqual(await syncStarred({ config: { ...config, starred: { enabled: false } }, imageDir: dir, log }), []);

  // cleanup keeps files of both lists and removes orphans
  await cleanupImages(dir, [first[0]]);
  assert.deepEqual((await readdir(dir)).filter(f => f.startsWith('star-')).length, 2);
  await cleanupImages(dir, []);
  assert.equal((await readdir(dir)).length, 0);

  server.close();
  await rm(dir, { recursive: true });
});

// ---------- rate limiting (HTTP 429) ----------

test('429: retried after waiting, then a persistent 429 stops further calls to that service', async () => {
  const good = await png(1600, 900, '#26a');
  const hits = { flaky: 0, down: 0 };
  const server = http.createServer((req, res) => {
    const send = (code, type, body, headers = {}) => (res.writeHead(code, { 'content-type': type, ...headers }), res.end(body));
    if (req.url === '/flaky') {
      hits.flaky++;
      return hits.flaky <= 2 ? send(429, 'text/plain', 'slow down', { 'retry-after': '0' }) : send(200, 'image/png', good);
    }
    if (req.url.startsWith('/down')) {
      hits.down++;
      return send(429, 'text/plain', 'no', { 'retry-after': '0' });
    }
    send(404, 'text/plain', 'x');
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const host = `127.0.0.1:${server.address().port}`;
  gatedHosts.set(host, 5); // treat the mock like a rate-limited third-party service
  const base = { repo: 'r', owner: 'o', branch: 'main', homepage: '', readme: '', config: { imagePriority: [], screenshot: { enabled: false } } };

  const ok = await findImage({ ...base, override: `http://${host}/flaky` });
  assert.ok(ok.buffer, 'succeeds after two 429s');
  assert.equal(hits.flaky, 3);

  const bad = await findImage({ ...base, override: `http://${host}/down` });
  assert.equal(bad.buffer, null);
  const callsAfterFirst = hits.down;
  assert.equal(callsAfterFirst, 3); // gave up after 3 tries
  const again = await findImage({ ...base, override: `http://${host}/down-2` });
  assert.equal(again.buffer, null);
  assert.equal(hits.down, callsAfterFirst, 'no more requests once the service is marked as rate limiting');
  assert.match(again.tries.join(' '), /rate limiting/);

  server.close();
});

test('sync: a project that only has a GitHub fallback card is upgraded on the next run', async () => {
  const good = await png(1600, 900, '#7a3');
  let base = '';
  const server = http.createServer((req, res) => {
    const send = (type, body, code = 200) => (res.writeHead(code, { 'content-type': type }), res.end(body));
    const url = req.url.split('?')[0];
    if (url === '/users/u/repos') {
      return send('application/json', JSON.stringify([{
        name: 'site', html_url: 'https://github.com/u/site', owner: { login: 'u' }, default_branch: 'main', homepage: `${base}/live/`,
        description: 'd', topics: [], language: 'JS', fork: false, archived: false, private: false,
        created_at: '2025-01-01T00:00:00Z', pushed_at: '2026-01-01T00:00:00Z', stargazers_count: 0
      }]));
    }
    if (url === '/live/') return send('text/html', '<meta property="og:image" content="/og.png">');
    if (url === '/og.png') return send('image/png', good);
    send('text/plain', 'x', 404);
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${server.address().port}`;
  process.env.GITHUB_API_URL = base;
  process.env.GITHUB_RAW_URL = base;

  const dir = await mkdtemp(path.join(os.tmpdir(), 'upg-'));
  const config = { username: 'u', imagePriority: ['readme', 'og'], screenshot: { enabled: false } };
  const previous = [{ repo: 'site', pushedAt: '2026-01-01T00:00:00Z', liveLink: `${base}/live/`, image: '/projects/auto/site', imageWidths: [640, 1024], imageSource: 'github' }];

  const [upgraded] = await sync({ config, previous, imageDir: dir, log: () => {} });
  assert.equal(upgraded.imageSource, 'og'); // was the generic card, now the real preview

  const [kept] = await sync({ config, previous: [upgraded], imageDir: dir, log: () => {} });
  assert.equal(kept.imageSource, 'og'); // a real preview is reused, not re-fetched

  server.close();
  await rm(dir, { recursive: true });
});

// ---------- ordering ----------

test('order: newest to oldest by creation date, nothing removed', () => {
  const p = (title, createdAt) => ({ title, createdAt, githubLink: `https://github.com/u/${title}`, year: createdAt.slice(0, 4), tech: [] });
  const list = [p('old', '2023-01-05T00:00:00Z'), p('newest', '2026-06-01T00:00:00Z'), p('mid', '2025-03-01T00:00:00Z'), p('newer', '2026-02-01T00:00:00Z')];
  assert.deepEqual(orderProjects(list).map(x => x.title), ['newest', 'newer', 'mid', 'old']);
  assert.equal(orderProjects(list).length, list.length);
});

test('order: dates fall back to repoDates, then year; ties keep their original order', () => {
  const link = n => `https://github.com/u/${n}`;
  const list = [
    { title: 'a', githubLink: link('a'), year: '2026' }, // year only -> 2026-01-01
    { title: 'b', githubLink: link('b'), year: '2025' }, // repoDates says it is the newest
    { title: 'c', githubLink: link('c'), year: '2026' }, // same year as a: keeps its place after a
    { title: 'd', githubLink: link('d'), year: 'oops' } // unparseable date sorts last
  ];
  assert.deepEqual(orderProjects(list, { repoDates: { b: '2026-09-09T00:00:00Z' } }).map(x => x.title), ['b', 'a', 'c', 'd']);
});
