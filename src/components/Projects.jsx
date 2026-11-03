import { Link } from 'react-router';
import ProjectCard from './ProjectCard.jsx';
import { SectionHeading } from './Section.jsx';
import { featuredProjects, projects } from '../data/site.js';

export default function Projects() {
  return (
      <section id="projects" aria-labelledby="projects-title">
      <div className="rv mb-6 flex flex-wrap items-end justify-between gap-4">
        <SectionHeading kicker="~/projects" id="projects-title">
          Featured work
        </SectionHeading>
        <Link className="btn btn-glass" to="/projects">
          View all projects →
        </Link>
      </div>

      <div className="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-5 max-[760px]:grid-cols-[minmax(0,1fr)]">
        {featuredProjects.map((project, i) => (
          <ProjectCard key={project.title} project={project} className={`rv${i % 2 ? ' rv-late' : ''}`} />
        ))}
      </div>

      <div className="glass holo-card rv mt-5 flex flex-wrap items-center justify-between gap-5 rounded-[20px] p-[clamp(20px,3vw,32px)]">
        <div className="max-w-[560px]">
          <p className="font-display text-[clamp(22px,3vw,28px)] leading-[1.15] font-bold tracking-[-0.02em]">
            {projects.length} projects and counting
          </p>
          <p className="mt-2 text-body">
            Dashboards, storefronts, landing pages and experiments, each with a live demo and source code.
          </p>
        </div>
        <Link className="btn btn-solid" to="/projects">
          Browse all projects →
        </Link>
      </div>
      </section>
  );
}
