export function Visualizer({ algorithm, values, step }) {
  if (algorithm.category === 'graph') {
    return <GraphVisualizer step={step} />;
  }
  if (algorithm.category === 'machine-learning') {
    return <VectorVisualizer />;
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

function GraphVisualizer({ step }) {
  const positions = { A: [50, 10], B: [25, 35], C: [75, 35], D: [15, 65], E: [38, 65], F: [75, 65], G: [45, 88] };
  return (
    <div className="graph-stage">
      {Object.entries(positions).map(([node, [left, top]]) => (
        <span key={node} className={`node ${step?.active?.includes(node) ? 'active' : ''}`} style={{ left: `${left}%`, top: `${top}%` }}>{node}</span>
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
