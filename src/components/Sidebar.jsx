import Icon from './Icon.jsx';
import { organizations, profile } from '../data/site.js';

function ContactRow({ icon, href, children }) {
  return (
    <a className="row" href={href}>
      <Icon name={icon} stroke="#bcc4ce" />
      {children}
    </a>
  );
}

export default function Sidebar() {
  return (
      <aside
      aria-label="Profile"
      className="glass holo-card sticky top-24 box-border flex max-w-full flex-[0_0_320px] flex-col gap-4 rounded-[20px] p-6 max-[980px]:static max-[980px]:flex-[1_1_100%]"
    >
      <div className="flex items-center gap-4">
        <img
          src={profile.photo.webp640}
          alt={`Portrait of ${profile.shortName}`}
          width="76"
          height="76"
          decoding="async"
          className="size-[76px] flex-none rounded-full border border-white/20 object-cover object-top shadow-[0_0_0_5px_rgba(255,255,255,0.05)]"
        />
        <div className="min-w-0">
          <h2 className="m-0 font-display text-[22px] leading-[1.15] font-bold tracking-[-0.02em]">{profile.name}</h2>
          <p className="mt-1 font-mono text-sm leading-snug text-muted">{profile.handle}</p>
        </div>
      </div>

      <p className="m-0 text-body">{profile.tagline}</p>

      <p className="flex items-center gap-2 text-sm text-muted">
        <Icon name="users" />
        <span>
          <b className="text-fg">{profile.followers}</b> followers · <b className="text-fg">{profile.following}</b>{' '}
          following
        </span>
      </p>

      <hr className="m-0 w-full border-0 border-t border-white/12" />

      <div className="flex flex-col gap-0.5 text-sm">
        <div className="row text-body">
          <Icon name="pin" stroke="#bcc4ce" />
          {profile.location}
        </div>
        <ContactRow icon="mail" href={`mailto:${profile.email}`}>
          {profile.email}
        </ContactRow>
        <ContactRow icon="phone" href={profile.whatsapp.href}>
          {profile.whatsapp.label}
        </ContactRow>
        <ContactRow icon="link" href={profile.website.href}>
          {profile.website.label}
        </ContactRow>
        <ContactRow icon="x" href={profile.x.href}>
          {profile.x.label}
        </ContactRow>
        <ContactRow icon="linkedin" href={profile.linkedin.href}>
          {profile.linkedin.label}
        </ContactRow>
      </div>

      <hr className="m-0 w-full border-0 border-t border-white/12" />

      <div>
        <h3 className="mb-3 font-mono text-xs leading-none font-medium text-muted">ORGANIZATIONS</h3>
        <ul className="flex flex-wrap gap-2">
          {organizations.map(org => (
            <li key={org.name}>
              <a href={org.href} className="tag flex items-center gap-2 py-1.5 pr-2.5 pl-1.5">
                <span
                  aria-hidden="true"
                  className={`flex size-5 items-center justify-center rounded-[5px] leading-none font-bold ${org.badgeClass}`}
                >
                  {org.badge}
                </span>
                {org.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <a className="btn btn-solid mt-1" href={`mailto:${profile.email}`}>
        Get in touch
      </a>
      </aside>
  );
}
