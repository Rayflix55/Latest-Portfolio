import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import Icon from './Icon.jsx';
import { nav, profile } from '../data/site.js';

export default function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = e => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
      <header className="sticky top-3 z-50 px-4 pt-3">
      <nav
        aria-label="Primary"
        className="glass mx-auto flex max-w-[1160px] items-center justify-between gap-3 rounded-2xl py-2 pr-2 pl-4"
      >
        <Link to="/" className="flex min-h-11 items-center gap-3" aria-label={`${profile.handle} – home`}>
          <span
            aria-hidden="true"
            className="flex size-8 items-center justify-center rounded-[10px] bg-fg font-display text-base leading-none font-bold text-ink"
          >
            R
          </span>
          <span className="font-mono text-[15px] leading-none font-medium">{profile.handle}</span>
        </Link>

        <div className="flex items-center gap-0.5 max-[760px]:hidden">
          {nav.map(item => (
            <Link key={item.hash} className="nlink" to={{ pathname: '/', hash: item.hash }}>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link className="btn btn-solid min-h-10 px-4 text-sm" to={{ pathname: '/', hash: '#contact' }}>
            Hire me
          </Link>
          <button
            type="button"
            className="btn btn-glass hidden min-h-10 w-11 px-0 max-[760px]:inline-flex"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(o => !o)}
          >
            <Icon name={open ? 'close' : 'menu'} size={18} />
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="glass mx-auto mt-2 flex max-w-[1160px] flex-col rounded-2xl p-2">
          {nav.map(item => (
            <Link
              key={item.hash}
              className="nlink px-3.5 py-4"
              to={{ pathname: '/', hash: item.hash }}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
      </header>
  );
}
