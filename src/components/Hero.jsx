import { Link } from 'react-router';
import { heroChips, profile, stats } from '../data/site.js';
import ParticleText from './ParticleText.jsx';

const chipPositions = [
  { className: 'chip-a right-5 top-0' },
  { className: 'chip-b right-[120px] top-[150px]' },
  { className: 'chip-c right-0 top-[300px]' }
];

export default function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative mx-auto box-border max-w-[1160px] px-6 pt-[clamp(48px,9vw,128px)] pb-[clamp(64px,9vw,120px)]"
    >
      <div className="hero-out max-w-[860px]">
        <p className="glass inline-flex items-center gap-2.5 rounded-full px-4 py-[9px] font-mono text-[13px] leading-none text-[#d5dbe3]">
          <span aria-hidden="true" className="inline-block size-2 rounded-full bg-accent" />
          {profile.role} · {profile.location}
        </p>

        <h1
          id="hero-title"
          className="mt-7 mb-6 font-display text-[clamp(44px,8.4vw,108px)] leading-[0.98] font-bold tracking-[-0.035em] text-fg"
        >
          Building apps.
          <br />
          Experimenting with code.
          <br />
          <ParticleText
            text="Shipping projects."
            className="w-full"
            style={{ color: 'var(--color-accent)', height: '1.05em', minHeight: '1.05em' }}
            particleSize={4}
            density={5}
            highlightColor="#eef0f3"
            intro="gather"
            scatter={130}
            gatherDuration={1500}
            stagger={250}
            trigger="hover"
            pointerRepel={28}
            repelRadius={110}
            idleDrift={0.35}
            fontSize="clamp(44px, 8.4vw, 108px)"
            fontWeight={700}
            glow
          />
        </h1>

        <p className="mb-9 max-w-[560px] text-[clamp(16px,2vw,20px)] leading-relaxed text-body">
          I&rsquo;m {profile.shortName}, also known as {profile.handle}, a Founding Frontend Engineer with 3+ years of
          experience building production-ready applications with React, Next.js, TypeScript, and Node.js.
        </p>

        <div className="flex flex-wrap gap-3">
          <Link className="btn btn-solid" to={{ pathname: '/', hash: '#projects' }}>
            View projects
          </Link>
          <Link className="btn btn-glass" to={{ pathname: '/', hash: '#contact' }}>
            Get in touch
          </Link>
        </div>

        <ul className="mt-[clamp(40px,6vw,72px)] flex flex-wrap gap-x-12 gap-y-5">
          {stats.map(stat => (
            <li key={stat.label}>
              <div className="font-display text-4xl leading-none font-bold tracking-[-0.02em]">{stat.value}</div>
              <div className="mt-1.5 font-mono text-[13px] leading-snug text-muted">{stat.label}</div>
            </li>
          ))}
        </ul>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-24 right-6 h-[420px] w-[300px] max-[1100px]:hidden"
      >
        {heroChips.map((label, i) => (
          <div
            key={label}
            className={`glass absolute rounded-2xl px-5 py-3.5 font-mono text-[15px] leading-none font-medium ${chipPositions[i].className}`}
          >
            {label}
          </div>
        ))}
      </div>
    </section>
  );
}
