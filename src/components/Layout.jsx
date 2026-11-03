import { Outlet } from 'react-router';
import Background from './Background.jsx';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import RouteEffects from './RouteEffects.jsx';

const updateHoloCard = event => {
  if (event.pointerType === 'touch' || !(event.target instanceof Element)) return;
  let card = event.target.closest('.holo-card');

  while (card) {
    const bounds = card.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
    const y = Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height));

    card.style.setProperty('--holo-x', `${x * 100}%`);
    card.style.setProperty('--holo-y', `${y * 100}%`);
    card.style.setProperty('--holo-rotate-x', `${(0.5 - y) * 10}deg`);
    card.style.setProperty('--holo-rotate-y', `${(x - 0.5) * 10}deg`);
    card.dataset.holoActive = 'true';
    card = card.parentElement?.closest('.holo-card') ?? null;
  }
};

const resetHoloCard = event => {
  if (!(event.target instanceof Element)) return;
  let card = event.target.closest('.holo-card');

  while (card) {
    if (!card.contains(event.relatedTarget)) {
      delete card.dataset.holoActive;
      card.style.removeProperty('--holo-rotate-x');
      card.style.removeProperty('--holo-rotate-y');
    }
    card = card.parentElement?.closest('.holo-card') ?? null;
  }
};

export default function Layout() {
  return (
    <div className="relative w-full overflow-x-clip bg-ink text-fg">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:bg-fg focus:px-4 focus:py-2.5 focus:font-semibold focus:text-ink"
      >
        Skip to content
      </a>
      <RouteEffects />
      {/* Lives in the layout so the animation keeps running across page changes */}
      <Background />
      <div className="relative z-10" onPointerMove={updateHoloCard} onPointerOut={resetHoloCard}>
        <Header />
        <Outlet />
        <Footer />
      </div>
    </div>
  );
}
