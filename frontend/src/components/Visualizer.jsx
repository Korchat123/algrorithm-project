import { useEffect, useRef } from 'react';

export function Visualizer({ algorithm, values, step, target }) {
  if (algorithm.category === 'graph') {
    return <GraphVisualizer algorithm={algorithm} step={step} />;
  }
  if (algorithm.category === 'machine-learning') {
    return <VectorVisualizer />;
  }

  if (algorithm.category === 'search') {
    return <SearchVisualizer algorithm={algorithm} values={values} step={step} target={target} />;
  }

  const max = Math.max(...values, 1);
  return (
    <div className="bars">
      {values.map((value, index) => (
        <div
          className={`bar ${step?.active?.includes(index) ? 'active' : ''} ${step?.found === index ? 'found' : ''}`}
          key={`${value}-${index}`}
          style={{ height: `${Math.max(18, (value / max) * 100)}%` }}
        >
          <span>{value}</span>
        </div>
      ))}
    </div>
  );
}

function SearchVisualizer({ algorithm, values, step, target }) {
  const displayValues = algorithm.slug === 'linear-search' ? values : [...values].sort((a, b) => a - b);
  const activeIndex = step?.active?.[0];
  const foundIndex = step?.found;
  const activeBoxRef = useRef(null);

  useEffect(() => {
    activeBoxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeIndex]);

  return (
    <div className="search-stage" style={{ '--item-count': displayValues.length }}>
      <div className="search-scroll">
        <div className="search-track">
        {displayValues.map((value, index) => (
          <span
            className={`number-box ${activeIndex === index ? 'active' : ''} ${foundIndex === index ? 'found' : ''}`}
            key={`${value}-${index}`}
            ref={activeIndex === index ? activeBoxRef : null}
          >
            <em className="box-marker top">{step?.low === index ? 'Low' : ''}</em>
            <strong>{value}</strong>
            <small>i {index}</small>
            <em className="box-marker bottom">{step?.high === index ? 'High' : ''}</em>
          </span>
        ))}
        </div>
        {Number.isInteger(activeIndex) && (
          <>
            <span
              className={`target-pointer ${Number.isInteger(foundIndex) ? 'found' : ''}`}
              style={{ gridColumn: `${activeIndex + 1} / span 1` }}
            />
            <span
              className={`search-cursor ${Number.isInteger(foundIndex) ? 'found' : ''}`}
              style={{ gridColumn: `${activeIndex + 1} / span 1` }}
            >
              compare
            </span>
            <strong className="target-box search-target" style={{ gridColumn: `${activeIndex + 1} / span 1` }}>
              <span>Find</span>
              {target}
            </strong>
          </>
        )}
      </div>
      <div className="search-explanation">
        <strong>{step?.phase || 'Step'}</strong>
        <p>{step?.detail || step?.message || 'Press Play to see what each search step does.'}</p>
      </div>
    </div>
  );
}

function GraphVisualizer({ algorithm, step }) {
  const positions = { A: [50, 10], B: [25, 35], C: [75, 35], D: [15, 65], E: [38, 65], F: [75, 65], G: [45, 88] };
  const edges = [['A', 'B'], ['A', 'C'], ['B', 'D'], ['B', 'E'], ['C', 'F'], ['E', 'G']];
  const activeEdge = step?.edge?.join('-');
  const visited = step?.visited || [];

  return (
    <div className={`graph-stage ${algorithm.slug === 'dfs' ? 'map-graph' : 'tree-graph'}`}>
      <svg className="graph-lines" viewBox="0 0 100 100" aria-hidden="true" preserveAspectRatio="none">
        {edges.map(([from, to]) => {
          const [x1, y1] = positions[from];
          const [x2, y2] = positions[to];
          const key = `${from}-${to}`;
          const isVisited = visited.includes(from) && visited.includes(to);
          return (
            <line
              className={`graph-line ${isVisited ? 'visited' : ''} ${activeEdge === key ? 'active' : ''}`}
              key={key}
              x1={x1}
              x2={x2}
              y1={y1}
              y2={y2}
            />
          );
        })}
      </svg>
      {Object.entries(positions).map(([node, [left, top]]) => (
        <span
          key={node}
          className={`node ${visited.includes(node) ? 'visited' : ''} ${step?.active?.includes(node) ? 'active' : ''}`}
          style={{ left: `${left}%`, top: `${top}%` }}
        >
          {node}
        </span>
      ))}
    </div>
  );
}

function VectorVisualizer() {
  return (
    <div className="vector-stage">
      {[
        ['A', 19, 75], ['B', 35, 36], ['C', 54, 52], ['D', 73, 28], ['Q', 47, 44]
      ].map(([label, left, top]) => (
        <span key={label} className={label === 'Q' ? 'query-point' : 'point'} style={{ left: `${left}%`, top: `${top}%` }}>{label}</span>
      ))}
    </div>
  );
}
