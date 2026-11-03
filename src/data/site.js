import github from './github-projects.json';

// All copy and links for the portfolio live here so content can be edited without touching components.

export const SITE_NAME = 'Akpe Samuel – Rayflix55';

export const profile = {
  name: 'Akpe (RAYFLIX) Samuel',
  shortName: 'Akpe Samuel',
  handle: 'Rayflix55',
  role: 'Founding Frontend Engineer',
  location: 'Abuja, Nigeria',
  email: 'rayflix55@gmail.com',
  whatsapp: { label: '+234 90 7116 7496', href: 'https://wa.me/2349071167496' },
  tagline: 'Founding Frontend Engineer building production-ready web applications for African SMEs.',
  followers: 3,
  following: 31,
  photo: { webp640: '/rayflix-640.webp', webp1024: '/rayflix.webp' },
  website: { label: 'rayflix55.vercel.app', href: 'https://rayflix55.vercel.app/' },
  x: { label: '@web3rayflix', href: 'https://x.com/web3rayflix' },
  linkedin: { label: 'in/akpe-samuel-993971329', href: 'https://www.linkedin.com/in/akpe-samuel-993971329' },
  github: 'https://github.com/Rayflix55',
  githubRepos: 'https://github.com/Rayflix55?tab=repositories'
};

export const nav = [
  { hash: '#projects', label: 'Projects' },
  { hash: '#stack', label: 'Stack' },
  { hash: '#experience', label: 'Experience' },
  { hash: '#services', label: 'Strengths' },
  { hash: '#contact', label: 'Contact' }
];

export const heroChips = ['react@19', 'next.js@14', 'typescript'];

export const organizations = [
  { name: 'Manom-Solutions', href: 'https://github.com/Manom-Solutions', badge: 'M', badgeClass: 'bg-fg text-ink font-sans text-[11px]' },
  { name: 'hngprojects', href: 'https://github.com/hngprojects', badge: '[]', badgeClass: 'bg-[#1f6feb] text-white font-mono text-[10px]' }
];

export const about = {
  heading: 'Founding engineer building for scale',
  quote:
    'I build production-ready web applications and responsive interfaces with React, Next.js, TypeScript, and Node.js.',
  body: 'Currently building the frontend foundation for an AI-powered business operating system serving African SMEs. My work spans frontend architecture, REST API integrations, state management, automated testing, accessibility, security, and performance optimization.',
  skills: [
    { title: 'Languages & frameworks', tech: 'TypeScript, JavaScript, React 19, Next.js 14, Svelte, Node.js, Express' },
    { title: 'Frontend & UI', tech: 'Tailwind CSS 4, Framer Motion, TanStack Table, Canvas, ECharts, Recharts, D3.js, Three.js' },
    { title: 'State & APIs', tech: 'Zustand, Pinia, REST APIs, SSE, client/server state management' },
    { title: 'Testing & tooling', tech: 'Vitest, Playwright, Vite 6, Git, CI/CD, Husky, ESLint, Prettier' },
    { title: 'Security & standards', tech: 'Web Crypto API, secure API proxies, WCAG 2.1 AA, PWA, Chrome Manifest V3' }
  ],
  highlights: [
    { value: '12+', label: 'Product modules', sub: 'Integrated with live APIs' },
    { value: '100%', label: 'Test coverage', sub: 'Unit and end-to-end tests' }
  ]
};

export const education = {
  degree: 'Bachelor of Science in Computer Science',
  location: 'Nigeria',
  period: 'Graduated May 2023'
};

export const engineeringStrengths = [
  { title: 'Software engineering', detail: 'Component-driven architecture, API integration, state management, testing, Git, and CI/CD.' },
  { title: 'Production mindset', detail: 'Security-aware API design, accessibility, performance optimization, responsive interfaces, and maintainable codebases.' }
];

const manualProjects = [
  { title: 'Yagazie Weng Foundation', category: 'Disability Support Platform', image: '/projects/1', liveLink: 'https://yagaziewengfoundationforthedeaf.org/', githubLink: 'https://github.com/Rayflix55/Yagazie-Weng-Umezurike-Foundation-', tech: ['Vanilla JS', 'TailwindCSS', 'HTML5'], year: '2026' },
  { title: 'BDI Foundation', category: 'Nonprofit Website', image: '/projects/2', liveLink: 'https://techbdi.com.ng/', githubLink: 'https://github.com/Chamberezigbo/Abaglobal', tech: ['HTML', 'CSS', 'SCSS', 'JavaScript', 'PHP'], year: '2025' }
];

const repoOf = url => url?.match(/github\.com\/([^/]+\/[^/?#]+)/i)?.[1].toLowerCase();
const privateProjects = github.projects.filter(project => project.private);
const manualRepos = new Set(manualProjects.map(project => repoOf(project.githubLink)));
const publicProjects = github.projects.filter(project => !project.private && !manualRepos.has(repoOf(project.githubLink)));
const orderedProjects = [...privateProjects, ...manualProjects, ...publicProjects];

export const projects = orderedProjects.map((project, i) => ({
  ...project,
  index: String(i).padStart(2, '0')
}));
export const featuredProjects = projects.slice(0, 4);

// Repos you have starred on GitHub (other people's work), newest star first.
export const starredRepos = github.starred ?? [];

export const stats = [
  { value: '12+', label: 'product modules integrated' },
  { value: '3', label: 'full-stack apps engineered' },
  { value: '34+', label: 'GitHub repositories' }
];

export const stack = {
  languages: ['TypeScript', 'JavaScript'],
  frameworks: ['React 19', 'Next.js 14', 'Svelte', 'Node.js', 'Express'],
  frontend: ['Tailwind CSS 4', 'Framer Motion', 'TanStack Table', 'HTML5 Canvas'],
  visualization: ['ECharts', 'Recharts', 'D3.js', 'Three.js'],
  stateAndApis: ['Zustand', 'Pinia', 'REST APIs', 'Server-Sent Events'],
  testingAndTooling: ['Vitest', 'Playwright', 'Vite 6', 'Git', 'CI/CD', 'Husky', 'ESLint', 'Prettier'],
  securityAndStandards: ['Web Crypto API', 'Secure API proxies', 'WCAG 2.1 AA', 'PWA', 'Chrome Manifest V3']
};

export const activity = {
  total: 412,
  contributedTo: { label: 'Manom-Solutions/manom-fe', href: 'https://github.com/Manom-Solutions/manom-fe' }
};

export const experience = [
  {
    title: 'Founding Frontend Engineer',
    org: 'Manom Solutions',
    orgHref: 'https://github.com/Manom-Solutions',
    period: 'Sep 2026 – Present · Remote, Nigeria',
    summary:
      'Architected the frontend foundation for an AI-powered business operating system serving African SMEs. Integrated 12+ modules with live backend APIs and established reusable UI patterns. Implemented JWT authentication with a cookie-to-localStorage fallback, a backend-driven onboarding state machine, and environment-based feature flags. Set up Husky, lint-staged, pre-push type checks, ESLint, and Prettier; fixed a GitHub Actions Docker deployment issue that caused silent rollbacks.',
    current: true
  },
  {
    title: 'Lead Website Developer',
    org: 'Yazagie Weng Umezurike Foundation for the Deaf',
    period: 'Jan 2026 – Present',
    summary:
      'Built and deployed the foundation platform to WCAG 2.1 AA standards, alongside an internal administration dashboard, real-time layout updates, volunteer onboarding portal, and donation pipeline.',
    current: true
  },
  {
    title: 'Frontend Developer Intern',
    org: 'Teysix CORE',
    period: 'Jun 2026 – Jul 2026',
    summary:
      'Engineered three full-stack applications—Analytics Suite, Outreach Engine, and Vervé—with React and Node.js. Built Express API proxies to protect LLM keys and resolve production CORS issues, responsive dashboards targeting 60 FPS with Framer Motion and Canvas, Zustand state flows, and interactive data visualizations with Recharts and D3.js.'
  },
  {
    title: 'Frontend Developer Intern',
    org: 'HNG Internship',
    orgHref: 'https://github.com/hngprojects',
    period: 'Jun 2026 – Jul 2026',
    summary:
      'Advanced through competitive rounds to Stage 6, delivering production-ready MVPs under tight deadlines. Built a Manifest V3 Chrome extension with DOM extraction and requests routed through a secure Node.js backend; a Next.js 14 SSR streak tracker with 100% unit and end-to-end test coverage; and a real-time React 19, TypeScript, and Vite dashboard with dynamic CSS-variable themes.'
  }
];

export const testimonials = [
  { name: 'Yagazie Weng', role: 'Executive Director, Weng Foundation for the Deaf', project: 'Disability Support Platform', text: "Samuel built something we genuinely couldn't find anywhere else: a platform that speaks the language of the deaf community, not just for it. The accessibility-first approach and clean UI made onboarding effortless for our beneficiaries.", accent: '#4ade80' },
  { name: 'David Okafor', role: 'Head of Product, Jupiter Analytics', project: 'Real-Time Analytics Dashboard', text: 'Real-time data at this visual fidelity is genuinely hard to pull off. Samuel delivered a dashboard that our engineers said would take a team of three. The performance under live data load impressed everyone at our demo.', accent: '#60a5fa' },
  { name: 'Bisi Daniels', role: 'Chief Technology Officer, BDI Foundation', project: 'UI Architecture', text: "We came with a scattered design system and left with a coherent, scalable UI architecture. Samuel's component thinking is precise: every interaction is intentional, nothing is filler.", accent: '#e879f9' }
];

export const contact = {
  heading: 'Have a project in mind?',
  body: "I'm a Founding Frontend Engineer based in Abuja, Nigeria. Interested in working together or just want to say hi? Send a message and I'll get back to you."
};
