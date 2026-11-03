import { SectionHeading } from './Section.jsx';
import { profile, starredRepos } from '../data/site.js';

const fileFor = (base, w) => (w === 1884 ? `${base}.webp` : `${base}-${w}.webp`);
const compact = n => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, '')}k` : String(n));

// Repos synced from your GitHub stars (see github.config.json). Hidden when there are none.
function StarredCard({ repo }) {
  const { owner, name, description, githubLink, liveLink, language, tech, stars, image, imageWidths = [] } = repo;
  const primary = liveLink || githubLink;

  return (
    <article className="glass holo-card pcard">
      {image && (
        <a
          className="pv relative block aspect-[1884/1031] bg-[#0d1117]"
          href={primary}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${owner}/${name}`}
          tabIndex={-1}
        >
          <picture className="block h-full w-full">
            <source
              type="image/webp"
              srcSet={imageWidths.map(w => `${fileFor(image, w)} ${w}w`).join(', ')}
              sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 400px"
            />
            <img
              src={fileFor(image, 1024)}
              alt={`${owner}/${name} preview`}
              width="1024"
              height="560"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-top"
            />
          </picture>
        </a>
      )}

      <div className="flex flex-1 flex-col gap-3.5 px-[22px] pt-5 pb-[22px]">
        <p className="m-0 flex items-center gap-2 font-mono text-xs leading-snug text-accent">
          <span aria-hidden="true">★</span>
          <span>
            {compact(stars)}
            <span className="sr-only"> stars</span>
          </span>
          {language && <span className="text-muted">· {language}</span>}
        </p>
        <h3 className="m-0 font-mono text-[17px] leading-[1.25] font-medium [overflow-wrap:anywhere]">
          <a href={githubLink} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
            <span className="text-muted">{owner}/</span>
            {name}
          </a>
        </h3>
        {description && <p className="m-0 text-[14.5px] text-body">{description}</p>}
        {tech.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {tech.map(t => (
              <li key={t} className="tag">
                {t}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto flex items-center justify-end gap-4 pt-1 text-sm">
          <a
            href={githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-8 items-center font-medium text-body hover:text-fg"
          >
            Repo<span className="sr-only"> {owner}/{name}</span>
          </a>
          {liveLink && (
            <a
              href={liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-8 items-center font-medium text-fg"
            >
              Live ↗<span className="sr-only"> site of {name}</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function StarredProjects() {
  if (!starredRepos.length) return null;

  return (
    <section aria-labelledby="starred-title" className="mt-20">
      <SectionHeading kicker="~/starred" id="starred-title" className="mb-4">
        Starred on GitHub
      </SectionHeading>
      <p className="mb-8 max-w-[640px] text-body">
        Open-source projects I&rsquo;ve starred and keep an eye on. These are other people&rsquo;s work, not mine.{' '}
        <a
          href={`${profile.github}?tab=stars`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          See all my stars ↗
        </a>
      </p>
      <div className="grid grid-cols-[repeat(3,minmax(0,1fr))] items-start gap-5 max-[1000px]:grid-cols-[repeat(2,minmax(0,1fr))] max-[640px]:grid-cols-[minmax(0,1fr)]">
        {starredRepos.map(repo => (
          <StarredCard key={repo.repo} repo={repo} />
        ))}
      </div>
    </section>
  );
}
