const DEFAULT_WIDTHS = [640, 1024, 1884];
const fileFor = (base, w) => (w === 1884 ? `${base}.webp` : `${base}-${w}.webp`);

export default function ProjectCard({ project, className = '', priority = false }) {
  const { title, category, index, image, imageWidths = DEFAULT_WIDTHS, liveLink, githubLink, tech, year, private: isPrivate } = project;
  const primary = liveLink || (isPrivate ? null : githubLink);
  const preview = image ? (
    <picture className="block h-full w-full">
      <source
        type="image/webp"
        srcSet={imageWidths.map(w => `${fileFor(image, w)} ${w}w`).join(', ')}
        sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 400px"
      />
      <img
        src={fileFor(image, 1024)}
        alt={`${title} website screenshot`}
        width="1024"
        height="560"
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className="h-full w-full object-cover object-top"
      />
    </picture>
  ) : (
    <span
      aria-hidden="true"
      className="flex h-full w-full items-center justify-center bg-[radial-gradient(ellipse_at_30%_20%,rgba(74,222,99,0.22),transparent_60%),#10151b] px-6 text-center font-display text-3xl leading-tight font-bold tracking-[-0.02em] text-fg/80"
    >
      {title}
    </span>
  );

  return (
      <article className={`glass holo-card pcard ${className}`.trim()}>
      {primary ? (
        <a
          className="pv relative block aspect-[1884/1031] bg-[#0d1117]"
          href={primary}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${title}`}
          tabIndex={-1}
        >
          {preview}
          {liveLink && (
            <span className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-black/60 px-2.5 py-1 font-mono text-[11px] leading-none text-emerald-400 backdrop-blur-sm">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-400" />
              Live
            </span>
          )}
        </a>
      ) : (
        <div className="pv relative block aspect-[1884/1031] bg-[#0d1117]">
          {preview}
          {liveLink && (
            <span className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-black/60 px-2.5 py-1 font-mono text-[11px] leading-none text-emerald-400 backdrop-blur-sm">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-400" />
              Live
            </span>
          )}
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3.5 px-[22px] pt-5 pb-[22px]">
        <p className="m-0 font-mono text-xs leading-snug text-accent">
          {index}{' // '}{category}
        </p>
        <h3 className="m-0 font-display text-[22px] leading-[1.15] font-bold tracking-[-0.02em]">{title}</h3>
        <ul className="flex flex-wrap gap-2">
          {tech.map(t => (
            <li key={t} className="tag">
              {t}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex items-center justify-between gap-3 pt-1 text-sm">
          <span className="font-mono text-xs text-muted">{year}</span>
          <span className="flex items-center gap-4">
            {githubLink && (
              <a
                href={githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-8 items-center font-medium text-body hover:text-fg"
              >
                Source<span className="sr-only"> code for {title}</span>
              </a>
            )}
            {liveLink && (
              <a
                href={liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-8 items-center font-medium text-fg"
              >
                Live ↗<span className="sr-only"> site of {title}</span>
              </a>
            )}
          </span>
        </div>
      </div>
      </article>
  );
}
