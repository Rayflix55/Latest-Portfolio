import { useState } from 'react';
import { Link } from 'react-router';
import ProjectCard from '../components/ProjectCard.jsx';
import StarredProjects from '../components/StarredProjects.jsx';
import { profile, projects } from '../data/site.js';

const years = ['All', ...[...new Set(projects.map(p => p.year))].sort((a, b) => b - a)];

export default function ProjectsPage() {
  const [year, setYear] = useState('All');
  const visible = year === 'All' ? projects : projects.filter(p => p.year === year);

  return (
      <main id="main" className="mx-auto box-border max-w-[1160px] px-6 pt-[clamp(40px,7vw,96px)] pb-24">
      <nav aria-label="Breadcrumb" className="mb-8 font-mono text-[13px] text-muted">
        <Link to="/" className="hover:text-fg">
          Home
        </Link>
        <span aria-hidden="true"> / </span>
        <span aria-current="page" className="text-fg">
          Projects
        </span>
      </nav>

      <header className="max-w-[760px]">
        <p className="kick">~/projects</p>
        <h1 className="font-display text-[clamp(40px,7vw,84px)] leading-[1] font-bold tracking-[-0.035em]">
          All projects
        </h1>
        <p className="mt-5 text-[clamp(16px,2vw,19px)] text-body">
          The complete collection: dashboards, SaaS landing pages, storefronts, nonprofit sites and web apps. Every
          project links to a live demo and its source code.
        </p>
      </header>

      <div role="group" aria-label="Filter projects by year" className="mt-10 mb-8 flex flex-wrap items-center gap-2">
        {years.map(y => (
          <button
            key={y}
            type="button"
            aria-pressed={year === y}
            onClick={() => setYear(y)}
            className={`btn min-h-10 px-4 text-sm ${year === y ? 'btn-solid' : 'btn-glass'}`}
          >
            {y}
          </button>
        ))}
        <span className="ml-2 font-mono text-[13px] text-muted" aria-live="polite">
          {visible.length} {visible.length === 1 ? 'project' : 'projects'}
        </span>
      </div>

      <div className="grid grid-cols-[repeat(3,minmax(0,1fr))] gap-5 max-[1000px]:grid-cols-[repeat(2,minmax(0,1fr))] max-[640px]:grid-cols-[minmax(0,1fr)]">
        {visible.map((project, i) => (
          <ProjectCard key={project.title} project={project} priority={i < 3} />
        ))}
      </div>

      <StarredProjects />

      <div className="glass holo-card mt-12 flex flex-wrap items-center justify-between gap-5 rounded-[20px] p-[clamp(20px,3vw,32px)]">
        <p className="max-w-[560px] font-display text-[clamp(20px,2.6vw,26px)] leading-[1.2] font-bold tracking-[-0.02em]">
          Want something like this built for you?
        </p>
        <div className="flex flex-wrap gap-3">
          <Link className="btn btn-solid" to={{ pathname: '/', hash: '#contact' }}>
            Get in touch
          </Link>
          <a className="btn btn-glass" href={profile.githubRepos} target="_blank" rel="noopener noreferrer">
            More on GitHub ↗
          </a>
        </div>
      </div>
      </main>
  );
}
