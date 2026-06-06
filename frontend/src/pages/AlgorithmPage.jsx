import { useEffect, useState } from 'react';
import { Code2, Play, Shuffle } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { algorithms, codeSamples } from '../assets/algorithms.js';
import { Practice } from '../components/Practice.jsx';
import { Visualizer } from '../components/Visualizer.jsx';
import { buildSteps, initialValues, parseValues, shuffle } from '../utils/algorithmSteps.js';

export function AlgorithmPage() {
  const { slug } = useParams();
  const algorithm = algorithms.find((item) => item.slug === slug) || algorithms[0];
  const [values, setValues] = useState(initialValues);
  const [input, setInput] = useState(initialValues.join(', '));
  const [target, setTarget] = useState(18);
  const [steps, setSteps] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [language, setLanguage] = useState('js');

  useEffect(() => {
    const parsed = parseValues(input);
    if (parsed.length) setValues(parsed);
  }, [input]);

  const currentStep = steps[stepIndex];

  const run = () => {
    const nextSteps = buildSteps(algorithm, values, Number(target));
    setSteps(nextSteps);
    setStepIndex(0);
  };

  const advance = () => {
    setStepIndex((index) => Math.min(index + 1, Math.max(steps.length - 1, 0)));
  };

  return (
    <section className="page algorithm-page">
      <div className="page-heading compact">
        <p className="eyebrow">{algorithm.category}</p>
        <h1>{algorithm.name}</h1>
        <p>{algorithm.summary}</p>
      </div>
      <div className="workbench">
        <section className="panel visual-panel">
          <div className="panel-title">
            <h2>Animation</h2>
            <button className="icon-button" onClick={run} title="Run animation"><Play size={18} /></button>
          </div>
          <div className="controls">
            <label>
              Mock data
              <input value={input} onChange={(event) => setInput(event.target.value)} />
            </label>
            <label>
              Target
              <input type="number" value={target} onChange={(event) => setTarget(event.target.value)} />
            </label>
            <button onClick={() => setInput(shuffle(values).join(', '))}><Shuffle size={16} />Shuffle</button>
          </div>
          <Visualizer algorithm={algorithm} values={values} step={currentStep} />
          <div className="step-row">
            <button onClick={advance} disabled={!steps.length || stepIndex === steps.length - 1}>Next step</button>
            <span>{currentStep?.message || 'Press run to generate steps.'}</span>
          </div>
        </section>
        <aside className="panel">
          <h2>Complexity</h2>
          <div className="complexity-table">
            <span>Best</span><strong>{algorithm.bigO.best}</strong>
            <span>Average</span><strong>{algorithm.bigO.average}</strong>
            <span>Worst</span><strong>{algorithm.bigO.worst}</strong>
            <span>Space</span><strong>{algorithm.bigO.space}</strong>
          </div>
          <Practice algorithm={algorithm} />
        </aside>
      </div>
      <section className="panel code-panel">
        <div className="panel-title">
          <h2><Code2 size={20} />Implementation examples</h2>
          <select value={language} onChange={(event) => setLanguage(event.target.value)}>
            <option value="js">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="go">Go</option>
            <option value="rust">Rust</option>
          </select>
        </div>
        <pre><code>{codeSamples[language]}</code></pre>
      </section>
    </section>
  );
}
