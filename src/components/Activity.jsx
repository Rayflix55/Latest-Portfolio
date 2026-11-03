import { SectionHeading } from './Section.jsx';
import { activity } from '../data/site.js';
import { buildContributionCells, contributionMonths } from '../utils/contributions.js';

const cells = buildContributionCells();
const dayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

export default function Activity() {
  return (
      <section id="activity" aria-labelledby="activity-title" className="rv">
      <SectionHeading kicker="~/activity" id="activity-title" className="mb-6">
        {activity.total} contributions in the last year
      </SectionHeading>

      <div className="glass holo-card flex flex-col gap-4 rounded-[20px] p-[clamp(18px,3vw,28px)]">
        <div
          role="img"
          aria-label={`Contribution calendar: ${activity.total} contributions on GitHub in the last year`}
          className="overflow-x-auto pb-1.5"
        >
          <div className="flex min-w-max gap-2" aria-hidden="true">
            <div className="flex w-7 flex-col gap-[3px] pt-[17px] text-[10.5px] leading-[11px] text-muted">
              {dayLabels.map((label, i) => (
                <span key={i} className="h-[11px]">
                  {label || '\u00a0'}
                </span>
              ))}
            </div>
            <div>
              <div className="mb-[3px] flex h-3.5 text-[10.5px] leading-[11px] text-muted">
                {contributionMonths.map(m => (
                  <span key={m.name + m.width} className="block flex-none" style={{ width: m.width }}>
                    {m.name}
                  </span>
                ))}
              </div>
              <div className="grid grid-flow-col grid-rows-[repeat(7,11px)] gap-[3px]">
                {cells.map((level, i) => (
                  <div key={i} className={`cell l${level}`} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-[13px] text-muted">
          <span>Commits, pull requests and code review on GitHub.</span>
          <span className="flex items-center gap-1" aria-hidden="true">
            Less
            <span className="cell" />
            <span className="cell l1" />
            <span className="cell l2" />
            <span className="cell l3" />
            <span className="cell l4" />
            More
          </span>
        </div>

        <hr className="m-0 w-full border-0 border-t border-white/12" />

        <div className="flex flex-wrap gap-x-12 gap-y-4">
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-xs leading-none text-muted">CONTRIBUTED TO</span>
            <a href={activity.contributedTo.href} className="inline-flex min-h-7 items-center font-medium">
              {activity.contributedTo.label}
            </a>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-xs leading-none text-muted">ORGANIZATIONS</span>
            <span className="inline-flex min-h-7 items-center gap-2 font-medium">
              <a href="https://github.com/Manom-Solutions">@Manom-Solutions</a>
              <span aria-hidden="true" className="text-muted">
                ·
              </span>
              <a href="https://github.com/hngprojects">@hngprojects</a>
            </span>
          </div>
        </div>
      </div>
      </section>
  );
}
