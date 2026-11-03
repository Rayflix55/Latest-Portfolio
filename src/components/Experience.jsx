import { SectionHeading } from './Section.jsx';
import { experience } from '../data/site.js';

export default function Experience() {
  return (
      <section id="experience" aria-labelledby="experience-title" className="rv">
      <SectionHeading kicker="~/experience" id="experience-title" className="mb-6">
        Where I&rsquo;ve shipped
      </SectionHeading>

      <div className="glass holo-card rounded-[20px] p-[clamp(22px,3.4vw,40px)]">
        <ol className="relative flex flex-col gap-8">
          <span aria-hidden="true" className="absolute top-2.5 bottom-2.5 left-[5px] w-px bg-white/20" />
          {experience.map(item => (
            <li key={`${item.title}-${item.org}`} className="relative pl-9">
              <span
                aria-hidden="true"
                className={`absolute top-[7px] left-0 size-[11px] rounded-full ${
                  item.current ? 'bg-accent shadow-[0_0_0_4px_rgba(74,222,99,0.2)]' : 'bg-muted'
                }`}
              />
              <div className="flex flex-wrap items-baseline gap-x-3.5 gap-y-1">
                <h3 className="font-display text-xl leading-[1.3] font-bold">{item.title}</h3>
                {item.org &&
                  (item.orgHref ? (
                    <a href={item.orgHref} className="text-accent">
                      {item.org}
                    </a>
                  ) : (
                    <span className="text-accent">{item.org}</span>
                  ))}
                <span className="font-mono text-[13px] leading-none text-muted">{item.period}</span>
              </div>
              <p className="mt-1.5 text-body">{item.summary}</p>
            </li>
          ))}
        </ol>
      </div>
      </section>
  );
}
