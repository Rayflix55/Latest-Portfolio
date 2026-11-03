import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { routeMeta } from '../seo.js';

const SITE = (import.meta.env.VITE_SITE_URL || '').replace(/\/$/, '');

function setMeta(selector, attr, value) {
  document.head.querySelector(selector)?.setAttribute(attr, value);
}

// Scroll to the hash target (or the top) on navigation, and keep <title>/<meta> in sync
// when the user navigates client-side. Prerendered HTML already has the right tags per route.
export default function RouteEffects() {
  const { pathname, hash, key } = useLocation();
  const firstRender = useRef(true);

  useEffect(() => {
    const meta = routeMeta[pathname] ?? routeMeta['/'];
    document.title = meta.title;
    setMeta('meta[name="description"]', 'content', meta.description);
    setMeta('meta[property="og:title"]', 'content', meta.title);
    setMeta('meta[property="og:description"]', 'content', meta.description);
    setMeta('meta[name="twitter:title"]', 'content', meta.title);
    setMeta('meta[name="twitter:description"]', 'content', meta.description);
    const url = `${SITE}${pathname === '/' ? '/' : pathname}`;
    setMeta('link[rel="canonical"]', 'href', url);
    setMeta('meta[property="og:url"]', 'content', url);
  }, [pathname]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      if (!hash) return;
    }
    const target = hash && document.getElementById(decodeURIComponent(hash.slice(1)));
    if (target) target.scrollIntoView();
    else window.scrollTo({ top: 0, behavior: 'instant' });
  }, [key, hash]);

  return null;
}
