// Usage:
//   node scripts/sync-github.mjs            sync, fail loudly on errors (CI / manual runs)
//   node scripts/sync-github.mjs --soft     sync, but on any error keep the cached data and exit 0 (used by `npm run build`)
//   node scripts/sync-github.mjs --force    re-download every preview image
// Env: GITHUB_TOKEN (recommended, avoids API rate limits), SKIP_GITHUB_SYNC=1 to skip entirely.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { sync, syncStarred, cleanupImages } from './lib/github-sync.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataFile = path.join(root, 'src/data/github-projects.json');
const imageDir = path.join(root, 'public/projects/auto');
const args = new Set(process.argv.slice(2));
const soft = args.has('--soft');

if (process.env.SKIP_GITHUB_SYNC === '1') {
  console.log('[github-sync] SKIP_GITHUB_SYNC=1, using cached data');
  process.exit(0);
}

const readJson = async file => JSON.parse(await readFile(file, 'utf8'));

try {
  const config = await readJson(path.join(root, 'github.config.json'));
  const cached = await readJson(dataFile).catch(() => ({ projects: [], starred: [] }));
  const token = process.env.PRIVATE_REPOS_TOKEN || process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  const force = args.has('--force');

  console.log(`[github-sync] ${config.username}${token ? ' (authenticated)' : ' (no token: low API rate limit)'}`);
  console.log('[github-sync] your repos:');
  const projects = await sync({ config, previous: cached.projects, imageDir, token, force });

  // Starred repos are a bonus: if listing them fails, keep the last known list instead of failing the sync.
  let starred = cached.starred ?? [];
  try {
    console.log('[github-sync] starred repos:');
    starred = await syncStarred({ config, previous: cached.starred, imageDir, token, force });
  } catch (err) {
    console.warn(`[github-sync] starred repos skipped: ${err.message}`);
  }

  await cleanupImages(imageDir, [...projects, ...starred]);

  const next = JSON.stringify({ username: config.username, projects, starred }, null, 2) + '\n';
  const before = await readFile(dataFile, 'utf8').catch(() => '');
  if (next !== before) {
    await mkdir(path.dirname(dataFile), { recursive: true });
    await writeFile(dataFile, next);
    console.log(`[github-sync] updated github-projects.json (${projects.length} projects, ${starred.length} starred)`);
  } else {
    console.log(`[github-sync] no changes (${projects.length} projects, ${starred.length} starred)`);
  }
} catch (err) {
  if (soft) {
    console.warn(`[github-sync] ${err.message}\n[github-sync] keeping cached GitHub data`);
  } else {
    console.error(`[github-sync] ${err.message}`);
    process.exit(1);
  }
}
