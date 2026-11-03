import { SectionHeading, WindowBar } from './Section.jsx';
import { stack } from '../data/site.js';

const keys = Object.keys(stack);
const pad = Math.max(...keys.map(k => k.length)) + 3; // quotes + colon

export default function Stack() {
  return (
      <section id="stack" aria-labelledby="stack-title" className="rv">
      <SectionHeading kicker="~/stack" id="stack-title" className="mb-6">
        Tools I build with
      </SectionHeading>
      <div className="glass holo-card overflow-hidden rounded-[20px]">
        <WindowBar label="stack.json" />
        <div className="overflow-x-auto px-6 py-5 font-mono text-[13.5px] leading-[1.9]">
          <pre className="m-0 font-[inherit] text-fg">
            <code>
              {'{\n'}
              {keys.map((k, i) => (
                <span key={k}>
                  {'  '}
                  <span className="tok-key">{`"${k}"`}</span>
                  {':'.padEnd(pad - k.length - 1, ' ')}[
                  {stack[k].map((item, j) => (
                    <span key={item}>
                      {j > 0 && ', '}
                      <span className="tok-str">{`"${item}"`}</span>
                    </span>
                  ))}
                  ]{i < keys.length - 1 ? ',' : ''}
                  {'\n'}
                </span>
              ))}
              {'}'}
            </code>
          </pre>
        </div>
      </div>
      </section>
  );
}
