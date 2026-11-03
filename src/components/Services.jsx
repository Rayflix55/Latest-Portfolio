import { SectionHeading } from './Section.jsx';
import { engineeringStrengths, education } from '../data/site.js';

export default function Services() {
  return (
      <section id="services" aria-labelledby="services-title" className="rv">
      <SectionHeading kicker="~/strengths" id="services-title" className="mb-6">
        Engineering strengths
      </SectionHeading>
      <ul className="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-5 max-[640px]:grid-cols-[minmax(0,1fr)]">
        {engineeringStrengths.map(strength => (
          <li key={strength.title} className="glass holo-card flex flex-col gap-3 rounded-[20px] p-[clamp(20px,3vw,28px)]">
            <h3 className="font-display text-[clamp(20px,2.4vw,26px)] leading-[1.15] font-bold tracking-[-0.02em]">
              {strength.title}
            </h3>
            <p className="text-body">{strength.detail}</p>
          </li>
        ))}
      </ul>

      <div className="glass holo-card mt-5 rounded-[20px] p-[clamp(20px,3vw,28px)]">
        <p className="font-mono text-xs text-accent">EDUCATION</p>
        <h3 className="mt-2 font-display text-xl leading-[1.2] font-bold">{education.degree}</h3>
        <p className="mt-1 text-sm text-body">
          {education.location} · {education.period}
        </p>
      </div>
      </section>
  );
}
