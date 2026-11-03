import Icon from './Icon.jsx';

export function SectionHeading({ kicker, id, children, className = '' }) {
  return (
      <div className={className}>
      <p className="kick">{kicker}</p>
      <h2 id={id} className="h2">
        {children}
      </h2>
      </div>
  );
}

// The "file tab" strip shared by the README and stack.json panels
export function WindowBar({ label }) {
  return (
      <div className="flex items-center gap-2.5 border-b border-white/10 px-[22px] py-3.5 font-mono text-[13px] leading-none text-muted">
      <Icon name="file" />
      {label}
      </div>
  );
}
