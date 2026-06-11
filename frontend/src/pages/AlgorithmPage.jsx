import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ChevronLeft, ChevronRight, Code2, Pause, Play, Shuffle, Square } from 'lucide-react';
import { Navigate, useParams } from 'react-router-dom';
import { Visualizer } from '../components/Visualizer.jsx';
import { fallbackAlgorithms, fetchAlgorithm, samplesForAlgorithm } from '../utils/algorithmData.js';
import { buildKnnPreview, buildSteps, buildVectorPreview, parseValues, shuffle } from '../utils/algorithmSteps.js';

export function AlgorithmPage() {
  const { slug } = useParams();
  const fallbackAlgorithm = fallbackAlgorithms.find((item) => item.slug === slug) || fallbackAlgorithms[0];
  const [algorithm, setAlgorithm] = useState(fallbackAlgorithm);
  const isKnn = algorithm.slug === 'knn';
  const isNearestNeighbor = isNearestNeighborAlgorithm(algorithm.slug);
  const isTextMachineLearning = isKnn || isNearestNeighbor;
  const samples = useMemo(() => samplesForAlgorithm(algorithm), [algorithm]);
  const languageOptions = useMemo(() => Object.keys(samples), [samples]);
  const fallbackDemo = useMemo(() => getFallbackDemo(fallbackAlgorithm), [fallbackAlgorithm]);
  const [values, setValues] = useState(() => parseValues(fallbackDemo.input));
  const [input, setInput] = useState(fallbackDemo.input);
  const [target, setTarget] = useState(fallbackDemo.target);
  const [steps, setSteps] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [language, setLanguage] = useState('js');

  useEffect(() => {
    let active = true;
    setAlgorithm(fallbackAlgorithm);
    fetchAlgorithm(slug)
      .then((item) => {
        if (active) setAlgorithm(item);
      })
      .catch(() => {
        if (active) setAlgorithm(fallbackAlgorithm);
      });
    return () => {
      active = false;
    };
  }, [fallbackAlgorithm, slug]);

  useEffect(() => {
    const parsed = parseValues(input);
    if (parsed.length) setValues(parsed);
  }, [input]);

  useEffect(() => {
    if (!samples[language]) {
      setLanguage(languageOptions[0] || 'js');
    }
  }, [algorithm.slug, language, languageOptions, samples]);

  const currentStep = steps[stepIndex];
  const knnPreviewStep = useMemo(() => (
    isKnn ? buildKnnPreview(algorithm.trainingExamples || input, target) : null
  ), [algorithm.trainingExamples, input, isKnn, target]);
  const nnPreviewStep = useMemo(() => (
    isNearestNeighbor ? buildVectorPreview(input, target, algorithm.slug) : null
  ), [algorithm.slug, input, isNearestNeighbor, target]);
  const visualStep = isTextMachineLearning ? currentStep || knnPreviewStep || nnPreviewStep : currentStep;
  const liveCode = samples.js || samples[languageOptions[0]] || 'No code example available.';
  const implementationCode = samples[language] || samples[languageOptions[0]] || 'No code example available.';
  const activeCodeLines = currentStep?.codeLines || [];
  const activeCodeTone = Number.isInteger(currentStep?.found) ? 'found' : 'active';
  const roundLabel = currentStep ? `${currentStep.round} / ${currentStep.totalRounds}` : `0 / ${steps.length}`;

  useEffect(() => {
    if (!isPlaying || !steps.length) return undefined;
    if (stepIndex >= steps.length - 1) {
      setIsPlaying(false);
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setStepIndex((index) => Math.min(index + 1, steps.length - 1));
    }, 900);

    return () => window.clearTimeout(timer);
  }, [isPlaying, stepIndex, steps.length]);

  useEffect(() => {
    const nextDemo = getAlgorithmDemo(algorithm, fallbackDemo);
    setInput(nextDemo.input);
    setTarget(nextDemo.target);
    setSteps([]);
    setStepIndex(0);
    setIsPlaying(false);
  }, [algorithm, fallbackDemo]);

  if (slug === 'vector-search') {
    return <Navigate to="/vector-search" replace />;
  }

  const run = () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }
    const nextSteps = buildSteps(algorithm, isKnn ? (algorithm.trainingExamples || input) : isTextMachineLearning ? input : values, isTextMachineLearning ? target : Number(target));
    setSteps(nextSteps);
    setStepIndex(0);
    setIsPlaying(nextSteps.length > 1);
  };

  const stop = () => {
    setIsPlaying(false);
    setStepIndex(0);
  };

  const showWorstCase = () => {
    const scenario = getWorstCaseScenario(algorithm, values);
    setIsPlaying(false);
    setValues(scenario.values);
    setInput(scenario.values.join(', '));
    setTarget(scenario.target);
    setSteps([]);
    setStepIndex(0);
  };

  const advance = () => {
    setIsPlaying(false);
    setStepIndex((index) => Math.min(index + 1, Math.max(steps.length - 1, 0)));
  };

  const back = () => {
    setIsPlaying(false);
    setStepIndex((index) => Math.max(index - 1, 0));
  };

  const shuffleData = () => {
    if (isTextMachineLearning) {
      const items = input.split(',').map((item) => item.trim()).filter(Boolean);
      const shuffledItems = shuffle(items);
      setIsPlaying(false);
      setSteps([]);
      setStepIndex(0);
      setInput(shuffledItems.join(', '));
      setTarget(shuffledItems[Math.floor(Math.random() * shuffledItems.length)] || '');
      return;
    }

    const shuffled = shuffle(values);
    setIsPlaying(false);
    setSteps([]);
    setStepIndex(0);
    setInput(shuffled.join(', '));
    setTarget(shuffled[Math.floor(Math.random() * shuffled.length)] || 0);
  };

  return (
    <section className="page algorithm-page">
      <div className="page-heading compact">
        <p className="eyebrow">{algorithm.category}</p>
        <h1>{algorithm.name}</h1>
        <p className="algorithm-detail">{algorithm.detail}</p>
        <p>{algorithm.summary}</p>
      </div>
      <div className="workbench">
        <section className="panel visual-panel">
          <div className="panel-title">
            <h2>Animation</h2>
          </div>
          <div className="controls">
            {!isTextMachineLearning && (
              <label>
                Mock data
                <input value={input} onChange={(event) => setInput(event.target.value)} />
              </label>
            )}
            <label>
              Target
              <input
                placeholder={isTextMachineLearning ? 'Type a word, for example airport' : undefined}
                type={isTextMachineLearning ? 'text' : 'number'}
                value={target}
                onChange={(event) => setTarget(event.target.value)}
              />
            </label>
            {!isTextMachineLearning && <button onClick={shuffleData}><Shuffle size={16} />Shuffle</button>}
          </div>
          <Visualizer algorithm={algorithm} values={isTextMachineLearning ? input : values} step={visualStep} target={target} />
          <div className="step-row">
            <div className="step-actions">
              <button onClick={back} disabled={!steps.length || stepIndex === 0}><ChevronLeft size={16} />Prev</button>
              <button onClick={run}>{isPlaying ? <Pause size={16} /> : <Play size={16} />}{isPlaying ? 'Pause' : 'Play'}</button>
              <button onClick={stop} disabled={!steps.length && !isPlaying}><Square size={16} />Stop</button>
              <button onClick={advance} disabled={!steps.length || stepIndex === steps.length - 1}>Next<ChevronRight size={16} /></button>
              {algorithm.category === 'search' && (
                <>
                  <button onClick={showWorstCase}><AlertTriangle size={16} />Worst case</button>
                  <strong className="round-count">Round {roundLabel}</strong>
                </>
              )}
            </div>
            <div className="step-message">
              {steps.length > 0 && <strong className="step-count">Step {stepIndex + 1} / {steps.length}</strong>}
              {currentStep?.phase && <strong className="step-phase">{currentStep.phase}</strong>}
              {!steps.length && <span>Press run to generate steps.</span>}
            </div>
          </div>
        </section>
        <aside className="panel side-panel">
          <div>
            <h2>Complexity</h2>
            <div className="complexity-table">
              <span>Best</span><strong>{formatRuntimeComplexity('best', algorithm.bigO.best)}</strong>
              <span>Average</span><strong>{formatAverageComplexity(algorithm.bigO.average)}</strong>
              <span>Worst</span><strong>{algorithm.bigO.worst}</strong>
              <span>Space</span><strong>{algorithm.bigO.space}</strong>
            </div>
          </div>
          <div className="live-code">
            <h2><Code2 size={18} />Live trace</h2>
            <CodeBlock code={liveCode} activeLines={activeCodeLines} activeTone={activeCodeTone} compact />
          </div>
        </aside>
      </div>
      <section className="panel code-panel">
        <div className="panel-title">
          <h2><Code2 size={20} />Implementation examples</h2>
          <select value={language} onChange={(event) => setLanguage(event.target.value)}>
            {languageOptions.map((option) => (
              <option key={option} value={option}>{languageLabels[option] || option}</option>
            ))}
          </select>
        </div>
        <CodeBlock code={implementationCode}/>
      </section>
    </section>
  );
}

function CodeBlock({ code, activeLines, activeTone = 'active', compact = false }) {
  const activeSet = new Set(activeLines);
  return (
    <pre className={`code-trace ${compact ? 'compact-code' : ''}`}>
      <code>
        {code.split('\n').map((line, index) => {
          const lineNumber = index + 1;
          const isActive = activeSet.has(lineNumber);
          return (
            <span className={`code-line ${isActive ? activeTone : ''}`} key={`${lineNumber}-${line}`}>
              <span className="line-number">{lineNumber}</span>
              <span className="line-text">{line || ' '}</span>
            </span>
          );
        })}
      </code>
    </pre>
  );
}

function getAlgorithmDemo(algorithm, fallbackDemo) {
  return {
    input: algorithm.demo?.input || fallbackDemo.input,
    target: algorithm.demo?.target || fallbackDemo.target
  };
}

function getFallbackDemo(algorithm) {
  if (algorithm.slug === 'knn') {
    return { input: '1, 2, 7, 8', target: '6' };
  }

  if (isNearestNeighborAlgorithm(algorithm.slug)) {
    return {
      input: 'king, queen, teacher, student, love, happy, elephant, tiger, dog, cat, apple, bread, car, train, airplane, school, forest, library, learn, science',
      target: 'the king loves the elephant in the forest'
    };
  }

  if (algorithm.category === 'graph') {
    return { input: '', target: 'A' };
  }

  return { input: '14, 7, 29, 3, 18, 41, 10, 24', target: 18 };
}

function isNearestNeighborAlgorithm(slug) {
  return ['ann', 'hnsw', 'kd-tree', 'brute-force-search'].includes(slug);
}

const languageLabels = {
  js: 'JavaScript',
  python: 'Python',
  java: 'Java',
  go: 'Go',
  rust: 'Rust'
};

function getWorstCaseScenario(algorithm, values) {
  const fallbackValues = values.length ? [...values] : parseValues(getFallbackDemo(algorithm).input);
  const sortedValues = [...fallbackValues].sort((a, b) => a - b);
  const missingAfterMax = Math.max(...sortedValues, 0) + 1;

  if (algorithm.slug === 'linear-search') {
    return {
      values: fallbackValues,
      target: missingAfterMax
    };
  }

  if (algorithm.slug === 'binary-search') {
    return {
      values: sortedValues,
      target: missingAfterMax
    };
  }

  if (algorithm.slug === 'jump-search') {
    return {
      values: sortedValues,
      target: missingAfterMax
    };
  }

  if (algorithm.slug === 'interpolation-search') {
    return {
      values: [1, 2, 3, 4, 5, 6, 7, 8, 1000],
      target: 8
    };
  }

  return {
    values: fallbackValues,
    target: missingAfterMax
  };
}

function formatRuntimeComplexity(type, value) {
  const notation = type === 'best' ? '\u03A9' : '\u0398';
  return value.replace(/^O/, notation);
}

function formatAverageComplexity(value) {
  return value.replace(/^O/, '\u0398');
}
