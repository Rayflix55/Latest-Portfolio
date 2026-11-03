// Orders the /projects list newest to oldest by creation date. Nothing is removed, only reordered.

const repoName = url => url?.match(/github\.com\/[^/]+\/([^/?#]+)/i)?.[1].toLowerCase();

// Best available creation date: exact date from GitHub, else the year the project is tagged with.
export function projectTime(project, repoDates = {}) {
  const t = Date.parse(project.createdAt ?? repoDates[repoName(project.githubLink)] ?? `${project.year}-01-01`);
  return Number.isNaN(t) ? 0 : t;
}

export function orderProjects(projects, { repoDates = {} } = {}) {
  return projects
    .map((project, i) => ({ project, i, time: projectTime(project, repoDates) }))
    .sort((a, b) => b.time - a.time || a.i - b.i) // ties keep their original order
    .map(r => r.project);
}
