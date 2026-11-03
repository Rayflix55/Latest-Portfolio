import { projects, SITE_NAME } from './data/site.js';

// Per-route metadata, shared by the prerender script and the client-side router.
export const routeMeta = {
  '/': {
    title: 'Akpe Samuel (Rayflix) – Founding Frontend Engineer | React, Next.js, TypeScript',
    description:
      'Portfolio of Akpe Samuel (Rayflix), Founding Frontend Engineer with 3+ years of experience in Abuja, Nigeria. Building production-ready applications with React, Next.js, TypeScript, and Node.js.'
  },
  '/projects': {
    title: `All Projects – ${SITE_NAME} | React, Next.js & Tailwind Work`,
    description: `Browse all ${projects.length} projects by Akpe Samuel (rayflixthetechbro): dashboards, SaaS landing pages, storefronts, nonprofit sites and web apps built with React, TypeScript, Vue and Tailwind CSS.`
  }
};

export const projectsJsonLd = site => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': `${site}/projects#page`,
  url: `${site}/projects`,
  name: 'All projects by Akpe Samuel',
  isPartOf: { '@id': `${site}/#website` },
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: projects.length,
    itemListElement: projects.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'CreativeWork',
        name: p.title,
        description: p.category,
        url: p.liveLink || p.githubLink,
        ...(p.image ? { image: `${site}${p.image}-1024.webp` } : {}),
        dateCreated: p.year,
        keywords: p.tech.join(', '),
        author: { '@id': `${site}/#person` }
      }
    }))
  }
});
