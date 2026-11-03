import { SectionHeading, WindowBar } from './Section.jsx';
import { about, education, engineeringStrengths, profile } from '../data/site.js';

const str = v => <span className="tok-str">&quot;{v}&quot;</span>;
const key = k => <span className="tok-key">{k}</span>;

export default function About() {
  return (
      <section id="about" aria-labelledby="about-title" className="rv">
      <div className="glass holo-card overflow-hidden rounded-[20px]">
        <WindowBar label={`${profile.handle} / README.md`} />
        <div className="p-[clamp(22px,3.4vw,40px)]">
          <SectionHeading kicker="~/about" id="about-title" className="mb-5">
            {about.heading}
          </SectionHeading>

          <div className="mb-6 grid grid-cols-[minmax(0,1fr)_minmax(0,220px)] items-start gap-8 max-[760px]:grid-cols-[minmax(0,1fr)]">
            <div>
              <p className="mb-4 max-w-[640px] text-[17px] text-fg italic">&ldquo;{about.quote}&rdquo;</p>
              <p className="mb-6 max-w-[640px] text-body">{about.body}</p>
            </div>
            <picture className="holo-card block aspect-square overflow-hidden rounded-2xl border border-white/15 max-[760px]:order-first max-[760px]:max-w-[220px]">
              <source
                type="image/webp"
                srcSet={`${profile.photo.webp640} 640w, ${profile.photo.webp1024} 1024w`}
                sizes="220px"
              />
              <img
                src={profile.photo.webp1024}
                alt={`Portrait of ${profile.shortName} (${profile.handle})`}
                width="1024"
                height="1024"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-top grayscale transition duration-700 hover:grayscale-0"
              />
            </picture>
          </div>

          <ul className="mb-6 grid grid-cols-[repeat(2,minmax(0,1fr))] gap-3 max-[640px]:grid-cols-[minmax(0,1fr)]">
            {about.skills.map(skill => (
              <li key={skill.title} className="holo-card rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5">
                <div className="text-sm font-semibold text-fg">{skill.title}</div>
                <div className="mt-1 font-mono text-xs text-muted">{skill.tech}</div>
              </li>
            ))}
          </ul>

          <dl className="mb-6 flex flex-wrap gap-x-12 gap-y-4">
            {about.highlights.map(h => (
              <div key={h.label}>
                <dd className="font-display text-4xl leading-none font-bold tracking-[-0.02em] text-accent">{h.value}</dd>
                <dt className="mt-1.5 text-sm font-semibold">{h.label}</dt>
                <dd className="font-mono text-xs text-muted">{h.sub}</dd>
              </div>
            ))}
          </dl>

          <div className="overflow-x-auto rounded-[14px] border border-white/10 bg-black/40 px-[22px] py-[18px] font-mono text-[13.5px] leading-[1.75]">
            <pre className="m-0 font-[inherit] text-fg">
              <code>
                <span className="tok-kw">const</span> <span className="tok-var">rayflix</span> = {'{'}
                {'\n  '}
                {key('name')}: {str(profile.shortName)},{'\n  '}
                {key('role')}: {str(profile.role)},{'\n  '}
                {key('stack')}: [{str('React')}, {str('Next.js')}, {str('TypeScript')}, {str('Node.js')}],{'\n  '}
                {key('location')}: {str(profile.location)},{'\n  '}
                {key('status')}: {str(profile.role)},{'\n'}
                {'};'}
              </code>
            </pre>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {engineeringStrengths.map(strength => (
              <div key={strength.title} className="holo-card rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5">
                <h3 className="text-sm font-semibold text-fg">{strength.title}</h3>
                <p className="mt-1 text-sm text-muted">{strength.detail}</p>
              </div>
            ))}
            <div className="holo-card rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 sm:col-span-2">
              <h3 className="text-sm font-semibold text-fg">{education.degree}</h3>
              <p className="mt-1 font-mono text-xs text-muted">
                {education.location} · {education.period}
              </p>
            </div>
          </div>
        </div>
      </div>
      </section>
  );
}
