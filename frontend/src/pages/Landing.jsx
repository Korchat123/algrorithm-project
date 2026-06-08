import { Gamepad2, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { heroBars } from '../assets/heroPreview.js';
import { InfoBlock } from '../components/InfoBlock.jsx';

export function Landing() {
  return (
    <section className="landing">
      <div className="hero">
        <div>
          <p className="eyebrow">MERN algorithm learning app</p>
          <h1>Learn algorithms by seeing every step move.</h1>
          <p className="hero-copy">
            Enter mock data, run animations, answer practice games, and compare implementation examples across common languages.
          </p>
          <div className="hero-actions">
            <Link className="primary-button large" to="/algorithms"><Play size={18} />Start visualizing</Link>
            <Link className="ghost-button large" to="/games"><Gamepad2 size={18} />Practice games</Link>
          </div>
        </div>
        <div className="hero-visual" aria-label="Algorithm animation preview">
          {heroBars.map((height, index) => (
            <span key={height} className={index === 3 ? 'active' : ''} style={{ height: `${height}%` }} />
          ))}
        </div>
      </div>
      <section className="complexity-band">
        <InfoBlock title="Big O" value="Upper bound" text="The maximum growth rate you should plan for. It describes worst-case scaling." />
        <InfoBlock title="Big Omega" value="Lower bound" text="The best guaranteed growth rate. It shows how fast the work can be at minimum." />
        <InfoBlock title="Big Theta" value="Tight bound" text="The practical match when upper and lower growth describe the same behavior." />
        <InfoBlock title="Space Complexity" value="Memory use" text="The extra memory an algorithm needs as input grows, such as arrays, stacks, queues, or recursion calls." />
      </section>
    </section>
  );
}
