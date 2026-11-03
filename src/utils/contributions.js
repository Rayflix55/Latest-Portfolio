// Deterministic (seeded) mock contribution calendar, so the server-rendered HTML
// and the hydrated client always match.

export function buildContributionCells(seed = 2026) {
  let s = seed;
  const rnd = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };

  const cells = [];
  for (let week = 0; week < 53; week++) {
    const active = 0.22 + 0.4 * Math.max(0, Math.sin(week / 5.5 + 1));
    for (let day = 0; day < 7; day++) {
      if (week === 52 && day > 1) {
        cells.push('x');
        continue;
      }
      const weekendFactor = day === 0 || day === 6 ? 0.4 : 1;
      let level = 0;
      if (rnd() < active * weekendFactor) {
        level = 1 + (rnd() < 0.45 ? 1 : 0) + (rnd() < 0.25 ? 1 : 0) + (rnd() < 0.1 ? 1 : 0);
        if (level > 4) level = 4;
      }
      cells.push(String(level));
    }
  }
  return cells;
}

const MONTH_NAMES = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
const WEEKS_PER_MONTH = [4, 5, 4, 4, 5, 4, 4, 5, 4, 4, 5, 5];

// 14px = 11px cell + 3px gap
export const contributionMonths = MONTH_NAMES.map((name, i) => ({ name, width: WEEKS_PER_MONTH[i] * 14 }));
