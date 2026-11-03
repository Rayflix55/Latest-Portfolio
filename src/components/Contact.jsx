import { contact, profile } from '../data/site.js';

export default function Contact() {
  return (
      <section id="contact" aria-labelledby="contact-title" className="rv">
      <div className="glass holo-card flex flex-col gap-8 rounded-3xl p-[clamp(28px,5vw,64px)]">
        <div className="max-w-[620px]">
          <p className="kick">~/contact</p>
          <h2 id="contact-title" className="h2 text-[clamp(34px,5.4vw,64px)]">
            {contact.heading}
          </h2>
          <p className="mt-4 text-[17px] text-body">{contact.body}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a className="btn btn-solid" href={`mailto:${profile.email}`}>
            Email me
          </a>
          <a className="btn btn-glass" href={profile.whatsapp.href} target="_blank" rel="noopener noreferrer">
            WhatsApp ↗
          </a>
          <a className="btn btn-glass" href={profile.linkedin.href}>
            LinkedIn ↗
          </a>
          <a className="btn btn-glass" href={profile.x.href}>
            X ↗
          </a>
          <a className="btn btn-glass" href={profile.github}>
            GitHub ↗
          </a>
        </div>
      </div>
      </section>
  );
}
