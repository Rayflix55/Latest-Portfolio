// Decorative mini "screenshots" drawn with CSS (no image requests, crisp at any size).
// Everything is sized in `cqw` (container query width) so the mock scales with the card.

const cq = n => (typeof n === 'number' ? `${n}cqw` : n);

function Bar({ w, h, bg, r = 1, style }) {
  return <span className="block" style={{ width: cq(w), height: cq(h), borderRadius: cq(r), background: bg, ...style }} />;
}

const mono = { fontFamily: 'var(--font-mono)' };
const display = { fontFamily: 'var(--font-display)' };

function Cadence() {
  return (
    <div className="absolute inset-0 flex bg-[#f2efe9]">
      <div className="flex flex-none flex-col" style={{ width: '17%', background: '#1a1e26', padding: '3cqw 2cqw', gap: cq(2) }}>
        <Bar w="70%" h={2} bg="#f0883e" />
        <Bar w="90%" h={1.6} bg="#3a4250" />
        <Bar w="60%" h={1.6} bg="#3a4250" />
        <Bar w="75%" h={1.6} bg="#3a4250" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col" style={{ padding: '3.5cqw 4cqw', gap: cq(2.4) }}>
        <div style={{ ...display, font: `700 ${cq(4)}/1 var(--font-display)`, color: '#1a1e26' }}>New campaign</div>
        <div className="flex" style={{ gap: cq(2) }}>
          {[0, 1].map(i => (
            <span key={i} className="flex-1" style={{ height: cq(6), borderRadius: cq(1.2), background: '#fff', border: '1px solid #ddd8cc' }} />
          ))}
          <span
            className="flex-none text-center"
            style={{ width: cq(15), height: cq(6), borderRadius: cq(1.2), background: '#1a1e26', color: '#fff', font: `600 ${cq(2.4)}/${cq(6)} var(--font-sans)` }}
          >
            Generate
          </span>
        </div>
        <div className="flex min-h-0 flex-1 flex-col" style={{ background: '#fff', borderRadius: cq(1.6), border: '1px solid #ddd8cc', padding: cq(2.4), gap: cq(1.6) }}>
          <Bar w="40%" h={2.2} bg="#1a1e26" />
          {['95%', '88%', '92%', '60%'].map(w => (
            <Bar key={w} w={w} h={1.4} bg="#d9d5cb" />
          ))}
        </div>
      </div>
    </div>
  );
}

function Verve() {
  return (
    <div className="absolute inset-0 flex flex-col items-center bg-[#0f1216]" style={{ padding: '3cqw 5cqw', gap: cq(3) }}>
      <div className="flex w-full items-center justify-between">
        <span style={{ font: `700 ${cq(2.8)}/1 var(--font-display)`, color: '#eef0f3' }}>verve</span>
        <span className="flex items-center" style={{ gap: cq(2) }}>
          <Bar w={6} h={1.4} bg="#3a4250" />
          <Bar w={6} h={1.4} bg="#3a4250" />
          <Bar w={10} h={3.6} r={2} bg="#eef0f3" />
        </span>
      </div>
      <div className="relative flex w-full flex-col items-center" style={{ gap: cq(1.8), marginTop: cq(3) }}>
        <span
          className="absolute"
          style={{ left: '60%', top: cq(-4), width: cq(16), height: cq(16), borderRadius: '50%', background: 'rgba(63,185,80,.28)', filter: `blur(${cq(1.8)})` }}
        />
        <Bar w="62%" h={4.6} bg="#eef0f3" />
        <Bar w="46%" h={4.6} bg="#eef0f3" />
        <Bar w="36%" h={1.6} bg="#5b6572" style={{ marginTop: cq(0.8) }} />
        <Bar w={18} h={5} r={3} bg="#f0883e" style={{ marginTop: cq(1.4) }} />
      </div>
      <div className="mt-auto flex w-full" style={{ gap: cq(2) }}>
        {[0, 1, 2].map(i => (
          <span key={i} className="flex-1" style={{ height: cq(13), borderRadius: cq(1.6), background: '#171c24', border: '1px solid rgba(255,255,255,.07)' }} />
        ))}
      </div>
    </div>
  );
}

const green = { bg: 'rgba(63,185,80,.18)', fg: '#3fb950' };
const amber = { bg: 'rgba(240,136,62,.18)', fg: '#f0883e' };
const gray = { bg: 'rgba(139,148,158,.2)', fg: '#8b949e' };
const invoiceRows = [
  { w: 30, ...green },
  { w: 22, ...amber },
  { w: 36, ...green },
  { w: 26, ...gray },
  { w: 32, ...amber }
];

function Invoice() {
  return (
    <div className="absolute inset-0 flex flex-col bg-[#12151b]" style={{ padding: '3.5cqw 4cqw', gap: cq(2) }}>
      <div className="flex flex-none items-center justify-between">
        <div style={{ font: `700 ${cq(4)}/1 var(--font-display)`, color: '#eef0f3' }}>Invoices</div>
        <Bar w={18} h={5} r={2.5} bg="#4493f8" />
      </div>
      {invoiceRows.map((row, i) => (
        <div key={i} className="flex flex-none items-center" style={{ gap: cq(2.4), height: cq(7), padding: `0 ${cq(2.4)}`, borderRadius: cq(1.4), background: '#1a1f27' }}>
          <Bar w={8} h={1.6} bg="#6b7480" style={{ flex: 'none' }} />
          <span className="flex-1" style={{ height: cq(1.6), maxWidth: cq(row.w), borderRadius: cq(1), background: '#3b4350' }} />
          <span className="ml-auto flex flex-none items-center justify-center" style={{ width: cq(14), height: cq(4), borderRadius: cq(1), background: row.bg, gap: cq(1.2) }}>
            <span style={{ width: cq(1.6), height: cq(1.6), borderRadius: '50%', background: row.fg }} />
            <Bar w={5} h={1.4} bg={row.fg} />
          </span>
        </div>
      ))}
    </div>
  );
}

const ennaColumns = [
  ['#cdbba2', '60%'],
  ['#a58e72', '50%'],
  ['#d9cfbd', '65%'],
  ['#8e7a63', '55%']
];

function Enna() {
  return (
    <div className="absolute inset-0 flex flex-col bg-[#efe9df]" style={{ padding: '3cqw 5cqw', gap: cq(3) }}>
      <div className="flex flex-none items-center justify-between">
        <span className="flex" style={{ gap: cq(1.6) }}>
          <Bar w={6} h={1.2} bg="#b7ac9a" />
          <Bar w={6} h={1.2} bg="#b7ac9a" />
        </span>
        <span style={{ font: `400 ${cq(3.4)}/1 Georgia, 'Times New Roman', serif`, letterSpacing: '.5em', color: '#2a2622', paddingLeft: '.5em' }}>ENNA</span>
        <span className="flex" style={{ gap: cq(1.6) }}>
          <Bar w={6} h={1.2} bg="#b7ac9a" />
          <Bar w={4} h={1.2} bg="#2a2622" />
        </span>
      </div>
      <div className="flex min-h-0 flex-1" style={{ gap: cq(2.4) }}>
        {ennaColumns.map(([bg, w]) => (
          <div key={bg} className="flex flex-1 flex-col" style={{ gap: cq(1.2) }}>
            <span className="flex-1" style={{ borderRadius: cq(0.6), background: bg }} />
            <Bar w={w} h={1.2} bg="#b7ac9a" />
          </div>
        ))}
      </div>
    </div>
  );
}

const scenes = { cadence: Cadence, verve: Verve, invoice: Invoice, enna: Enna };

export default function ProjectPreview({ kind, host }) {
  const Scene = scenes[kind];
  return (
      <div
      role="img"
      aria-label={`Preview of ${host}`}
      className="relative flex aspect-[16/10] w-full flex-col overflow-hidden bg-[#0d1117]"
      style={{ containerType: 'inline-size' }}
    >
      <div
        aria-hidden="true"
        className="flex flex-none items-center border-b border-white/[0.08] bg-[#161b22]"
        style={{ height: cq(7.5), gap: cq(1.2), padding: `0 ${cq(2.4)}` }}
      >
        {[0, 1, 2].map(i => (
          <span key={i} style={{ width: cq(1.6), height: cq(1.6), borderRadius: '50%', background: '#394150' }} />
        ))}
        <span
          className="overflow-hidden whitespace-nowrap"
          style={{ ...mono, marginLeft: cq(2), flex: `0 1 ${cq(46)}`, height: cq(4), borderRadius: cq(2), background: '#0d1117', color: '#8d96a0', font: `500 ${cq(2.2)}/${cq(4)} var(--font-mono)`, padding: `0 ${cq(2)}` }}
        >
          {host}
        </span>
        </div>
      <div aria-hidden="true" className="relative min-h-0 flex-1 overflow-hidden">
        <Scene />
      </div>
    </div>
  );
}
