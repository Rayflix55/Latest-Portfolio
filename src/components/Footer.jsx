import { profile } from '../data/site.js';

export default function Footer() {
  return (
      <footer className="border-t border-white/10 bg-[rgba(8,10,13,0.5)]">
      <div className="mx-auto box-border flex max-w-[1160px] flex-wrap justify-between gap-2 p-6 text-[13px] text-muted">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span className="font-mono">
          {profile.role} · {profile.location}
        </span>
      </div>
      </footer>
  );
}
