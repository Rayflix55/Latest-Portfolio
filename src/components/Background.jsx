import { lazy, Suspense, useEffect, useState } from 'react';

// ogl + shaders are heavy and purely decorative, so they load in a separate chunk,
// only on the client, and only after the page has loaded and the browser is idle.
// Compiling the WebGL shaders blocks the main thread, so we make sure that happens
// after the content is already visible and interactive. The server-rendered HTML
// never touches `window`.
const PatternWaves = lazy(() => import('./PatternWaves.jsx'));

export default function Background() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let handle;
    const idle = window.requestIdleCallback ?? (cb => window.setTimeout(cb, 300));
    const stopIdle = window.cancelIdleCallback ?? window.clearTimeout;
    const go = () => {
      handle = idle(() => !cancelled && setReady(true), { timeout: 2000 });
    };
    if (document.readyState === 'complete') go();
    else window.addEventListener('load', go, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener('load', go);
      if (handle) stopIdle(handle);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-ink">
      {ready && (
        <Suspense fallback={null}>
          <PatternWaves
            preset="silk"
            color="#4ade63"
            backgroundColor="#0b0d10"
            fade="edges"
            fadeSize={0.7}
            opacity={0.85}
            speed={0.8}
            depth={1.15}
            shine={1.2}
            contrast={1.35}
            scale={0.9}
            interactive
            cursorSize={85}
            cursorStrength={0.9}
          />
        </Suspense>
      )}
      {/* Keeps body text readable over the animation */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(11,13,16,0.12)_0%,rgba(11,13,16,0.55)_100%)]" />
    </div>
  );
}
