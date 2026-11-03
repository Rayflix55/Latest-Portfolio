import { SectionHeading } from './Section.jsx';
import { testimonials } from '../data/site.js';

export default function Testimonials() {
  return (
      <section id="feedback" aria-labelledby="feedback-title" className="rv">
      <SectionHeading kicker="~/feedback" id="feedback-title" className="mb-6">
        What clients say
      </SectionHeading>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-5">
        {testimonials.map(t => (
          <figure key={t.name} className="glass holo-card m-0 flex flex-col gap-4 rounded-[20px] p-[clamp(20px,3vw,28px)]">
            <p className="m-0 font-mono text-[11px] tracking-wide uppercase" style={{ color: t.accent }}>
              {t.project}
            </p>
            <blockquote className="m-0 flex-1 text-[15px] leading-relaxed text-body">&ldquo;{t.text}&rdquo;</blockquote>
            <figcaption className="flex items-center gap-3 border-t border-white/10 pt-4">
              <span
                aria-hidden="true"
                className="flex size-11 flex-none items-center justify-center rounded-full border font-mono text-xs font-bold"
                style={{ color: t.accent, borderColor: `${t.accent}55`, background: `${t.accent}14` }}
              >
                {t.name
                  .split(' ')
                  .map(w => w[0])
                  .join('')}
              </span>
              <span>
                <span className="block text-sm font-semibold text-fg">{t.name}</span>
                <span className="block text-xs text-muted">{t.role}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
      </section>
  );
}
