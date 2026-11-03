// Build-time GitHub -> portfolio sync.
//
// 1. Lists your public repos from the GitHub API.
// 2. Keeps the ones that look like showcase projects (live site and/or README screenshot).
// 3. Lists the repos you have starred (other people's work, shown separately).
// 4. Finds a preview image for each: README screenshot, the live site's og:image,
//    a rendered screenshot of the live site, or GitHub's repo card (configurable order).
// 5. Saves resized WebP files and writes src/data/github-projects.json.

import { mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

export const API = () => process.env.GITHUB_API_URL || 'https://api.github.com';
export const RAW = () => process.env.GITHUB_RAW_URL || 'https://raw.githubusercontent.com';

const UA = 'rayflix-portfolio-sync';
const ASPECT = 1884 / 1031;
export const WIDTHS = [640, 1024, 1884];

// ---------- small helpers ----------

export async function fetchWithTimeout(url, { timeout = 15000, headers = {}, ...opts } = {}) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), timeout);
  try {
    return await fetch(url, { redirect: 'follow', ...opts, headers: { 'User-Agent': UA, ...headers }, signal: ctl.signal });
  } finally {
    clearTimeout(timer);
  }
}

export const slugify = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const TECH_NAMES = {
  reactjs: 'React', react: 'React', nextjs: 'Next.js', 'next-js': 'Next.js', vuejs: 'Vue', vue: 'Vue', 'vue3': 'Vue 3',
  svelte: 'Svelte', sveltekit: 'SvelteKit', typescript: 'TypeScript', javascript: 'JavaScript', nodejs: 'Node.js',
  'node-js': 'Node.js', expressjs: 'Express', express: 'Express', tailwindcss: 'Tailwind CSS', tailwind: 'Tailwind CSS',
  vite: 'Vite', html: 'HTML', html5: 'HTML5', css: 'CSS', css3: 'CSS3', scss: 'SCSS', sass: 'Sass', php: 'PHP',
  postgresql: 'PostgreSQL', firebase: 'Firebase', mongodb: 'MongoDB', 'framer-motion': 'Framer Motion',
  zustand: 'Zustand', recharts: 'Recharts', echarts: 'ECharts', pinia: 'Pinia', python: 'Python', threejs: 'Three.js'
};

const prettyTopic = t => TECH_NAMES[t] ?? t.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

export function prettyTitle(name) {
  const words = name.replace(/[-_]+/g, ' ').trim();
  // keep names that already have deliberate casing (e.g. "House-Of-Enna" -> "House Of Enna")
  return /[A-Z]/.test(words) ? words : words.replace(/\b\w/g, c => c.toUpperCase());
}

// ---------- GitHub API ----------

export async function listRepos(username, token) {
  const headers = { Accept: 'application/vnd.github+json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const repos = [];
  for (let page = 1; page <= 5; page++) {
    const res = await fetchWithTimeout(`${API()}/users/${username}/repos?per_page=100&type=owner&sort=pushed&page=${page}`, { headers });
    if (!res.ok) {
      const hint = res.status === 403 || res.status === 429 ? ' (rate limited: set PRIVATE_REPOS_TOKEN or GITHUB_TOKEN)' : '';
      throw new Error(`GitHub API ${res.status} for ${username}${hint}`);
    }
    const batch = await res.json();
    repos.push(...batch);
    if (batch.length < 100) break;
  }
  return repos;
}

export async function fetchReadme(owner, repo, branch) {
  for (const name of ['README.md', 'readme.md', 'Readme.md', 'README.markdown', 'README']) {
    try {
      const res = await fetchWithTimeout(`${RAW()}/${owner}/${repo}/${branch}/${name}`, { timeout: 10000 });
      if (res.ok) return await res.text();
    } catch {
      /* try next */
    }
  }
  return '';
}

// ---------- image discovery ----------

const BAD_URL = /shields\.io|badgen|badge|travis-ci|codecov|coveralls|\/actions\/workflows|vercel\.com\/button|netlify\.com\/img|capsule-render|komarev|readme-typing|skillicons|github-readme-stats|profile-views|\.svg(\?|#|$)/i;
const GOOD = /screenshot|preview|demo|banner|hero|cover|mockup|home|landing|dashboard|desktop|app|ui\b/i;
const MEH = /logo|icon|avatar|emoji|favicon|sponsor|author|contributor/i;

export function resolveReadmeUrl(raw, { owner, repo, branch }) {
  let url = raw.trim().replace(/^<|>$/g, '');
  if (!url || url.startsWith('data:')) return null;
  if (url.startsWith('//')) url = `https:${url}`;
  if (/^https?:\/\//i.test(url)) {
    // github.com/o/r/blob/branch/path.png -> raw
    const m = url.match(/^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+?)(\?.*)?$/i);
    return m ? `${RAW()}/${m[1]}/${m[2]}/${m[3]}/${m[4]}` : url;
  }
  const clean = url.replace(/^\.?\//, '').split(/[?#]/)[0];
  return `${RAW()}/${owner}/${repo}/${branch}/${clean}`;
}

/** Candidate screenshot URLs from a README, best guess first. */
export function extractReadmeImages(markdown, ctx) {
  const found = [];
  const push = (url, alt = '') => {
    const resolved = resolveReadmeUrl(url, ctx);
    if (resolved && !BAD_URL.test(resolved)) found.push({ url: resolved, alt });
  };
  for (const m of markdown.matchAll(/!\[([^\]]*)\]\(\s*(<[^>]+>|[^)\s]+)(?:\s+["'][^"']*["'])?\s*\)/g)) push(m[2], m[1]);
  for (const m of markdown.matchAll(/<img\b[^>]*>/gi)) {
    const src = m[0].match(/\bsrc\s*=\s*["']([^"']+)["']/i)?.[1];
    const alt = m[0].match(/\balt\s*=\s*["']([^"']*)["']/i)?.[1] ?? '';
    if (src) push(src, alt);
  }
  const seen = new Set();
  return found
    .filter(f => !seen.has(f.url) && seen.add(f.url))
    .map((f, i) => {
      const hay = `${f.alt} ${f.url}`;
      return { ...f, score: (GOOD.test(hay) ? 5 : 0) - (MEH.test(hay) ? 6 : 0) - i * 0.1 };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map(f => f.url);
}

export function extractOgImage(html, pageUrl) {
  const metas = html.match(/<meta\b[^>]*>/gi) ?? [];
  for (const wanted of ['og:image', 'og:image:url', 'twitter:image', 'twitter:image:src']) {
    for (const tag of metas) {
      const key = tag.match(/\b(?:property|name)\s*=\s*["']([^"']+)["']/i)?.[1]?.toLowerCase();
      const content = tag.match(/\bcontent\s*=\s*["']([^"']+)["']/i)?.[1];
      if (key === wanted && content) {
        try {
          return new URL(content.replace(/&amp;/g, '&'), pageUrl).href;
        } catch {
          /* ignore */
        }
      }
    }
  }
  return null;
}

async function ogImageOf(homepage) {
  const res = await fetchWithTimeout(homepage, { timeout: 10000, headers: { Accept: 'text/html' } });
  if (!res.ok) return null;
  return extractOgImage(await res.text(), res.url || homepage);
}

// ---------- image download + processing ----------

// ---- polite access to free third-party image services ----
// Screenshot / card services rate-limit bursts (HTTP 429). Calls to them are made one at a time with
// a pause in between, a 429 is retried after waiting, and if a service keeps refusing we stop
// calling it for the rest of the run instead of hammering it. Projects that only got a fallback
// image (or none) are retried automatically on the next sync.
export const gatedHosts = new Map([
  ['api.microlink.io', 1500],
  ['opengraph.githubassets.com', 700]
]);
const queues = new Map();
const tripped = new Set();
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function gated(url, fn) {
  const host = new URL(url).host;
  const gap = gatedHosts.get(host);
  if (gap === undefined) return fn();
  if (tripped.has(host)) return Promise.reject(new Error('skipped: service is rate limiting this run'));
  const prev = queues.get(host) ?? Promise.resolve();
  const run = prev.then(() => (tripped.has(host) ? Promise.reject(new Error('skipped: service is rate limiting this run')) : fn()));
  queues.set(host, run.then(() => sleep(gap), () => sleep(gap)));
  return run;
}

async function download(url, attempts = 3) {
  return gated(url, async () => {
    for (let i = 0; ; i++) {
      const res = await fetchWithTimeout(url, { timeout: 25000, headers: { Accept: 'image/*' } });
      if ((res.status === 429 || res.status === 503) && i < attempts - 1) {
        const header = res.headers.get('retry-after');
        const wait = header !== null && !Number.isNaN(Number(header)) ? Number(header) * 1000 : 2500 * (i + 1);
        await sleep(Math.min(wait, 15000));
        continue;
      }
      if (res.status === 429 && gatedHosts.has(new URL(url).host)) tripped.add(new URL(url).host);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const type = res.headers.get('content-type') || '';
      if (type && !/^image\//i.test(type) && !/octet-stream/i.test(type)) throw new Error(`not an image (${type})`);
      return Buffer.from(await res.arrayBuffer());
    }
  });
}

/** Validates a buffer looks like a real screenshot, then writes 640/1024/1884 WebP files. */
export async function processImage(buffer, slug, outDir) {
  const meta = await sharp(buffer).metadata();
  if (!meta.width || !meta.height) throw new Error('unreadable image');
  if (meta.format === 'svg') throw new Error('svg');
  if (meta.width < 400 || meta.height < 180) throw new Error(`too small (${meta.width}x${meta.height})`);
  const ratio = meta.width / meta.height;
  if (ratio < 0.8 || ratio > 3.2) throw new Error(`odd aspect ratio (${ratio.toFixed(2)})`);

  await mkdir(outDir, { recursive: true });
  const widths = WIDTHS.filter((w, i) => i < 2 || meta.width >= w * 0.85);
  for (const w of widths) {
    const file = w === WIDTHS[2] ? `${slug}.webp` : `${slug}-${w}.webp`;
    await sharp(buffer)
      .rotate()
      .resize({ width: w, height: Math.round(w / ASPECT), fit: 'cover', position: 'top' })
      .webp({ quality: 78 })
      .toFile(path.join(outDir, file));
  }
  return widths;
}

/** Tries each configured source in order until one yields a usable image. */
export async function findImage({ repo, owner, branch, homepage, readme, config, override }) {
  const tries = [];
  const sources = {
    override: async () => (override ? [override] : []),
    readme: async () => extractReadmeImages(readme, { owner, repo, branch }),
    og: async () => {
      if (!homepage) return [];
      const og = await ogImageOf(homepage);
      return og ? [og] : [];
    },
    screenshot: async () =>
      homepage && config.screenshot?.enabled !== false
        ? [`https://api.microlink.io/?url=${encodeURIComponent(homepage)}&screenshot=true&meta=false&embed=screenshot.url&viewport.width=1440&viewport.height=900&waitForTimeout=2500`]
        : [],
    github: async () => [`https://opengraph.githubassets.com/1/${owner}/${repo}`]
  };
  const order = override ? ['override', ...config.imagePriority] : config.imagePriority;
  for (const source of order) {
    let urls = [];
    try {
      urls = await sources[source]?.() ?? [];
    } catch (err) {
      tries.push(`${source}: ${err.message}`);
      continue;
    }
    for (const url of urls) {
      try {
        const buffer = await download(url);
        return { buffer, source, url, tries };
      } catch (err) {
        tries.push(`${source}: ${err.message}`);
      }
    }
  }
  return { buffer: null, source: null, url: null, tries };
}

// ---------- main sync ----------

export function toProject(r, { homepage, override = {} }) {
  const tech = (override.tech ?? (r.topics?.length ? r.topics.map(prettyTopic) : r.language ? [r.language] : [])).slice(0, 5);
  return {
    repo: r.name,
    title: override.title ?? prettyTitle(r.name),
    category: override.category ?? (r.description?.trim() || (r.language ? `${r.language} project` : 'Open-source project')),
    githubLink: r.html_url,
    liveLink: override.liveLink ?? homepage ?? '',
    tech,
    year: String(new Date(r.created_at).getFullYear()),
    createdAt: r.created_at,
    stars: r.stargazers_count ?? 0,
    pushedAt: r.pushed_at
  };
}

export function normalizeHomepage(h) {
  if (!h) return '';
  const url = /^https?:\/\//i.test(h.trim()) ? h.trim() : `https://${h.trim()}`;
  try {
    return new URL(url).href;
  } catch {
    return '';
  }
}

async function pool(items, size, fn) {
  const results = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(size, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        results[i] = await fn(items[i], i);
      }
    })
  );
  return results;
}

export async function sync({ config, repos: givenRepos, previous = [], imageDir, urlBase = '/projects/auto', token, force = false, log = console.log }) {
  const repos = givenRepos ?? (await listRepos(config.username, token));
  const exclude = new Set((config.exclude ?? []).map(s => s.toLowerCase()));
  const overrides = config.overrides ?? {};
  const prev = new Map(previous.map(p => [p.repo, p]));

  const eligible = repos
    .filter(r => !r.private && !r.disabled)
    .filter(r => config.includeForks || !r.fork)
    .filter(r => config.includeArchived || !r.archived)
    .filter(r => !exclude.has(r.name.toLowerCase()) && !overrides[r.name]?.hidden);

  const privateProjects = config.includePrivate
    ? repos
        .filter(r => r.private && !r.disabled)
        .filter(r => config.includeForks || !r.fork)
        .filter(r => config.includeArchived || !r.archived)
        .filter(r => !exclude.has(r.name.toLowerCase()) && !overrides[r.name]?.hidden)
        .map(r => {
          const override = overrides[r.name] ?? {};
          return {
            ...toProject(r, { homepage: normalizeHomepage(override.liveLink), override }),
            githubLink: '',
            private: true,
            image: null,
            imageWidths: [],
            imageSource: null
          };
        })
        .sort((a, b) => new Date(b.pushedAt) - new Date(a.pushedAt))
    : [];
  if (config.includePrivate && !token) {
    log('  ! private repos require a GITHUB_TOKEN with access to those repositories');
  }

  const candidates = eligible;
  const projects = (
    await pool(candidates, 4, async r => {
      const override = overrides[r.name] ?? {};
      const homepage = normalizeHomepage(override.liveLink ?? r.homepage);
      const old = prev.get(r.name);
      const slug = slugify(r.name);
      const unchanged = !force && old && old.pushedAt === r.pushed_at && old.liveLink === (homepage || '') && (old.image === null || old.image);

      let image = null;
      let imageWidths = [];
      let imageSource = null;

      if (unchanged && old.image && old.imageSource !== 'github') {
        ({ image, imageWidths, imageSource } = old); // reuse files already on disk
      } else {
        const branch = r.default_branch || 'main';
        const readme = await fetchReadme(r.owner.login, r.name, branch);
        const found = await findImage({ repo: r.name, owner: r.owner.login, branch, homepage, readme, config, override: override.image });
        const hasRealPreview = found.buffer && found.source !== 'github';

        // Only showcase repos: a live site, or a real screenshot in the README
        if (!homepage && !hasRealPreview) {
          log(`  - skip ${r.name} (no live site and no README screenshot)`);
          return null;
        }
        if (found.buffer) {
          // a source can return a valid download that still fails validation: fall through to the next
          try {
            imageWidths = await processImage(found.buffer, slug, imageDir);
            image = `${urlBase}/${slug}`;
            imageSource = found.source;
          } catch (err) {
            found.tries.push(`${found.source}: ${err.message}`);
          }
        }
        if (!image) log(`  ! ${r.name}: no preview image (${found.tries.join('; ') || 'nothing to try'})`);
      }

      log(`  + ${r.name}${image ? ` [${imageSource}]` : ' [no image]'}${homepage ? ' ' + homepage : ''}`);
      return { ...toProject(r, { homepage, override }), image, imageWidths, imageSource };
    })
  ).filter(Boolean);

  projects.sort((a, b) => new Date(b.pushedAt) - new Date(a.pushedAt));
  const limited = projects.slice(0, config.maxProjects ?? 60);

  return [...privateProjects, ...limited];
}

/** Deletes preview files that no listed project or starred repo references any more. */
export async function cleanupImages(imageDir, entries) {
  const keep = new Set(entries.filter(e => e.image).map(e => path.basename(e.image)));
  try {
    for (const file of await readdir(imageDir)) {
      const base = file.replace(/(-\d+)?\.webp$/, '');
      if (file.endsWith('.webp') && !keep.has(base)) await rm(path.join(imageDir, file));
    }
  } catch {
    /* directory may not exist yet */
  }
}

// ---------- starred repos ----------

export async function listStarred(username, token) {
  const headers = { Accept: 'application/vnd.github+json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetchWithTimeout(`${API()}/users/${username}/starred?per_page=100`, { headers });
  if (!res.ok) {
    const hint = res.status === 403 || res.status === 429 ? ' (rate limited: set GITHUB_TOKEN to raise the limit)' : '';
    throw new Error(`GitHub API ${res.status} listing stars for ${username}${hint}`);
  }
  return res.json(); // most recently starred first
}

export function toStarred(r, { homepage }) {
  return {
    repo: r.full_name,
    owner: r.owner.login,
    name: r.name,
    description: r.description?.trim() || '',
    githubLink: r.html_url,
    liveLink: homepage || '',
    language: r.language || '',
    tech: (r.topics ?? []).slice(0, 3).map(prettyTopic),
    stars: r.stargazers_count ?? 0,
    pushedAt: r.pushed_at
  };
}

/**
 * Repos you have starred, newest star first. These are other people's projects, so they are
 * kept apart from your own work. A preview image is only used when the repo really has one
 * (README screenshot / live-site og:image by default), never a generic placeholder card.
 */
export async function syncStarred({ config, previous = [], imageDir, urlBase = '/projects/auto', token, force = false, log = console.log }) {
  const cfg = config.starred ?? {};
  if (cfg.enabled === false) return [];

  const me = config.username.toLowerCase();
  const exclude = new Set((cfg.exclude ?? []).map(s => s.toLowerCase()));
  const prev = new Map(previous.map(p => [p.repo, p]));
  const imageConfig = { imagePriority: cfg.imagePriority ?? ['readme', 'og'], screenshot: { enabled: false } };

  const picked = (await listStarred(config.username, token))
    .filter(r => !r.private && !r.disabled)
    .filter(r => r.owner.login.toLowerCase() !== me) // your own repos are already listed as projects
    .filter(r => !exclude.has(r.full_name.toLowerCase()))
    .filter(r => cfg.includeArchived || !r.archived)
    .slice(0, cfg.maxProjects ?? 12);

  return pool(picked, 4, async r => {
    const homepage = normalizeHomepage(r.homepage);
    const entry = toStarred(r, { homepage });
    const old = prev.get(r.full_name);

    if (!force && old && old.pushedAt === r.pushed_at && old.liveLink === homepage) {
      log(`  * ${r.full_name}${old.image ? ` [${old.imageSource}]` : ' [no image]'} (unchanged)`);
      return { ...entry, image: old.image ?? null, imageWidths: old.imageWidths ?? [], imageSource: old.imageSource ?? null };
    }

    const branch = r.default_branch || 'main';
    const readme = await fetchReadme(r.owner.login, r.name, branch);
    const found = await findImage({ repo: r.name, owner: r.owner.login, branch, homepage, readme, config: imageConfig });
    let image = null;
    let imageWidths = [];
    let imageSource = null;
    if (found.buffer) {
      try {
        const slug = `star-${slugify(r.full_name)}`;
        imageWidths = await processImage(found.buffer, slug, imageDir);
        image = `${urlBase}/${slug}`;
        imageSource = found.source;
      } catch {
        /* unusable image: show the card without one */
      }
    }
    log(`  * ${r.full_name}${image ? ` [${imageSource}]` : ' [no image]'}`);
    return { ...entry, image, imageWidths, imageSource };
  });
}
