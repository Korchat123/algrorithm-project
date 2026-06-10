import { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

const algorithms = {
  'brute-force': {
    name: 'Brute Force Search',
    time: 'O(n × d)',
    space: 'O(n × d)',
    description: 'Compare query with every single point in the dataset.',
  },
  'kd-tree': {
    name: 'KD-Tree Search',
    time: 'O(log n)',
    space: 'O(n × d)',
    description: 'Use spatial partitioning to eliminate regions without candidates.',
  },
  'hnsw': {
    name: 'HNSW (Hierarchical Navigable Small World)',
    time: 'O(log n)',
    space: 'O(n)',
    description: 'Navigate through hierarchical layers, skipping irrelevant points.',
  },
};

const distanceMetrics = {
  euclidean: {
    name: 'Euclidean Distance',
    formula: '√((x₁-x₂)² + (y₁-y₂)²)',
    calc: (p1, p2) => Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2),
  },
  manhattan: {
    name: 'Manhattan Distance',
    formula: '|x₁-x₂| + |y₁-y₂|',
    calc: (p1, p2) => Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y),
  },
  cosine: {
    name: 'Cosine Similarity',
    formula: '(A·B) / (||A|| × ||B||)',
    calc: (p1, p2) => {
      const dot = p1.x * p2.x + p1.y * p2.y;
      const mag1 = Math.sqrt(p1.x ** 2 + p1.y ** 2);
      const mag2 = Math.sqrt(p2.x ** 2 + p2.y ** 2);
      return mag1 * mag2 === 0 ? 0 : dot / (mag1 * mag2);
    },
  },
};

export function VectorSearch() {
  const canvasRef = useRef(null);
  const [algorithm, setAlgorithm] = useState('brute-force');
  const [metric, setMetric] = useState('euclidean');
  const [points] = useState(
    Array.from({ length: 30 }, () => ({
      x: Math.random() * 500,
      y: Math.random() * 500,
      id: Math.random(),
    }))
  );
  const [queryPoint, setQueryPoint] = useState({ x: 250, y: 250 });
  const [k, setK] = useState(3);
  const [radius, setRadius] = useState(100);
  const [isAnimating, setIsAnimating] = useState(false);
  const [comparisons, setComparisons] = useState(0);
  const [results, setResults] = useState([]);
  const [measured, setMeasured] = useState(new Set());

  const getCanvasPoint = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const handleCanvasClick = (e) => {
    const point = getCanvasPoint(e);
    setQueryPoint({
      x: point.x,
      y: point.y,
    });
  };

  const runSearch = async () => {
    setIsAnimating(true);
    setComparisons(0);
    setMeasured(new Set());
    setResults([]);

    const calc = distanceMetrics[metric].calc;
    let comparisons = 0;

    for (let i = 0; i < points.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 50));
      const dist = calc(queryPoint, points[i]);
      comparisons++;
      setComparisons(comparisons);
      setMeasured(prev => new Set([...prev, points[i].id]));

      if (dist <= radius) {
        setResults(prev => [...prev, { point: points[i], distance: dist }]);
      }
    }

    setResults(prev =>
      prev
        .sort((a, b) => a.distance - b.distance)
        .slice(0, k)
        .map(r => ({ ...r, isResult: true }))
    );

    setIsAnimating(false);
  };

  const reset = () => {
    setComparisons(0);
    setMeasured(new Set());
    setResults([]);
    setIsAnimating(false);
  };

  return (
    <div className="page-container">
      <section className="hero">
        <h1>Vector Search Fundamentals</h1>
        <p>
          Learn how vector search works through interactive visualizations of distance
          metrics and search algorithms.
        </p>
      </section>

      <section className="concept-section">
        <h2>Definition</h2>
        <p>
          Vector search is a search method that represents data as numeric vectors
          and finds the closest vectors to a query vector. Instead of matching only
          exact words, it compares distance or similarity in vector space, so items
          with similar meaning, shape, behavior, or features can be ranked together.
        </p>
      </section>

      <section className="concept-section">
        <h2>Vector Operations</h2>
        <div className="concept-grid">
          <div className="concept-card">
            <h3>📐 Distance Metrics</h3>
            <p>
              Different ways to measure distance between vectors. Each has different
              properties and use cases.
            </p>
          </div>
          <div className="concept-card">
            <h3>🔍 Search Algorithms</h3>
            <p>
              Various algorithms to efficiently find nearest neighbors with different
              trade-offs between speed and accuracy.
            </p>
          </div>
          <div className="concept-card">
            <h3>⚡ Performance Trade-offs</h3>
            <p>
              Compare time complexity, space usage, and actual operation counts for
              different search strategies.
            </p>
          </div>
          <div className="concept-card">
            <h3>📊 K-Nearest Neighbors</h3>
            <p>
              Find the K closest points to a query. Common in recommendation systems,
              classification, and similarity search.
            </p>
          </div>
        </div>
      </section>

      {/* Distance Metrics Comparison */}
      <section
        style={{
          margin: '48px 0',
          background: '#f9faf8',
          border: '1px solid #eef3ed',
          borderRadius: '8px',
          padding: '32px',
        }}
      >
        <h2 style={{ color: '#14231f', marginTop: 0 }}>Distance Metrics Comparison</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          {Object.entries(distanceMetrics).map(([key, info]) => (
            <div
              key={key}
              style={{
                background: '#ffffff',
                border: metric === key ? '2px solid #1f6f58' : '1px solid #d8ded2',
                borderRadius: '8px',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onClick={() => {
                setMetric(key);
                reset();
              }}
            >
              <h3 style={{ color: '#14231f', margin: '0 0 8px 0' }}>{info.name}</h3>
              <code style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '8px' }}>
                {info.formula}
              </code>
              <p style={{ color: '#52615b', fontSize: '13px', margin: 0 }}>
                {key === 'euclidean' && 'Straight-line distance in space'}
                {key === 'manhattan' && 'Grid-based distance (taxicab)'}
                {key === 'cosine' && 'Angle between vectors (direction)'}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Search Algorithm Interactive */}
      <section style={{ margin: '48px 0' }}>
        <h2 style={{ color: '#14231f' }}>Interactive Vector Search</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          {/* Controls */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #d8ded2',
              borderRadius: '8px',
              padding: '20px',
            }}
          >
            <h3 style={{ color: '#14231f', margin: '0 0 16px 0' }}>Settings</h3>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#24433a', fontWeight: '600', marginBottom: '8px', fontSize: '13px' }}>
                Algorithm:
              </label>
              <select
                value={algorithm}
                onChange={(e) => {
                  setAlgorithm(e.target.value);
                  reset();
                }}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d8ded2',
                  borderRadius: '6px',
                  fontSize: '13px',
                }}
              >
                {Object.entries(algorithms).map(([key, info]) => (
                  <option key={key} value={key}>
                    {info.name}
                  </option>
                ))}
              </select>
              <p style={{ color: '#52615b', fontSize: '12px', margin: '4px 0 0 0' }}>
                Time: {algorithms[algorithm].time} | Space: {algorithms[algorithm].space}
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#24433a', fontWeight: '600', marginBottom: '8px', fontSize: '13px' }}>
                Distance Metric:
              </label>
              <select
                value={metric}
                onChange={(e) => {
                  setMetric(e.target.value);
                  reset();
                }}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d8ded2',
                  borderRadius: '6px',
                  fontSize: '13px',
                }}
              >
                {Object.entries(distanceMetrics).map(([key, info]) => (
                  <option key={key} value={key}>
                    {info.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#24433a', fontWeight: '600', marginBottom: '8px', fontSize: '13px' }}>
                K (neighbors): <strong>{k}</strong>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={k}
                onChange={(e) => setK(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#24433a', fontWeight: '600', marginBottom: '8px', fontSize: '13px' }}>
                Search Radius: <strong>{radius}px</strong>
              </label>
              <input
                type="range"
                min="10"
                max="300"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={runSearch}
                disabled={isAnimating}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: isAnimating ? '#ccc' : '#1f6f58',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: isAnimating ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  fontWeight: '600',
                }}
              >
                <Play size={16} /> Run Search
              </button>
              <button
                onClick={reset}
                style={{
                  padding: '10px',
                  background: '#ffffff',
                  color: '#52615b',
                  border: '1px solid #d8ded2',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                }}
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>

          {/* Metrics */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #d8ded2',
              borderRadius: '8px',
              padding: '20px',
            }}
          >
            <h3 style={{ color: '#14231f', margin: '0 0 16px 0' }}>Metrics</h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div
                style={{
                  background: '#f5f7f2',
                  padding: '12px',
                  borderRadius: '6px',
                  borderLeft: '4px solid #1f6f58',
                }}
              >
                <div style={{ color: '#52615b', fontSize: '12px' }}>Comparisons</div>
                <div style={{ color: '#14231f', fontSize: '24px', fontWeight: '700' }}>
                  {comparisons}
                </div>
              </div>
              <div
                style={{
                  background: '#f5f7f2',
                  padding: '12px',
                  borderRadius: '6px',
                  borderLeft: '4px solid #3b82f6',
                }}
              >
                <div style={{ color: '#52615b', fontSize: '12px' }}>Results Found</div>
                <div style={{ color: '#14231f', fontSize: '24px', fontWeight: '700' }}>
                  {results.length}/{k}
                </div>
              </div>
              <div
                style={{
                  background: '#f5f7f2',
                  padding: '12px',
                  borderRadius: '6px',
                  borderLeft: '4px solid #f59e0b',
                }}
              >
                <div style={{ color: '#52615b', fontSize: '12px' }}>Algorithm</div>
                <div style={{ color: '#14231f', fontSize: '14px', fontWeight: '600' }}>
                  {algorithms[algorithm].name}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #d8ded2',
            borderRadius: '8px',
            overflow: 'hidden',
            marginBottom: '24px',
          }}
        >
          <canvas
            ref={canvasRef}
            width={600}
            height={500}
            onClick={handleCanvasClick}
            style={{
              background: '#f9faf8',
              cursor: 'crosshair',
              display: 'block',
              width: '100%',
            }}
            onMouseMove={(e) => {
              const { x, y } = getCanvasPoint(e);
              canvasRef.current.title = `Move query to: ${Math.round(x)}, ${Math.round(y)}`;
            }}
          />
          <VectorCanvas
            canvasRef={canvasRef}
            points={points}
            queryPoint={queryPoint}
            radius={radius}
            measured={measured}
            results={results}
          />
          <div style={{ padding: '12px 16px', background: '#f9faf8', borderTop: '1px solid #eef3ed', fontSize: '12px', color: '#52615b' }}>
            Click canvas to move query point (red dot). Press Run Search to find k-nearest neighbors.
          </div>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #d8ded2',
              borderRadius: '8px',
              padding: '20px',
            }}
          >
            <h3 style={{ color: '#14231f', margin: '0 0 16px 0' }}>Top {k} Nearest Neighbors</h3>
            <div style={{ display: 'grid', gap: '8px' }}>
              {results.map((r, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#f5f7f2', borderRadius: '6px' }}>
                  <span style={{ color: '#14231f', fontWeight: '600' }}>#{idx + 1}</span>
                  <span style={{ color: '#52615b' }}>Distance: {r.distance.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Complexity Comparison */}
      <section className="complexity-section">
        <h2>Algorithm Complexity Comparison</h2>
        <div className="complexity-table">
          <table>
            <thead>
              <tr>
                <th>Algorithm</th>
                <th>Time Complexity</th>
                <th>Space Complexity</th>
                <th>Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Brute Force</td>
                <td>O(n × d)</td>
                <td>O(n × d)</td>
                <td>Small datasets, simple implementation</td>
              </tr>
              <tr>
                <td>KD-Tree</td>
                <td>O(log n)</td>
                <td>O(n × d)</td>
                <td>Low dimensions (up to 20D), static data</td>
              </tr>
              <tr>
                <td>HNSW</td>
                <td>O(log n)</td>
                <td>O(n)</td>
                <td>High dimensions, large datasets, dynamic</td>
              </tr>
              <tr>
                <td>LSH</td>
                <td>O(n × h)</td>
                <td>O(n × h)</td>
                <td>Approximate results, high speed needed</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function VectorCanvas({ canvasRef, points, queryPoint, radius, measured, results }) {
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    const width = canvasRef.current.width;
    const height = canvasRef.current.height;

    ctx.fillStyle = '#f9faf8';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#d8ded2';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let i = 0; i <= height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    // Search radius
    ctx.strokeStyle = 'rgba(255, 165, 0, 0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(queryPoint.x, queryPoint.y, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Data points
    points.forEach(p => {
      const isResult = results.some(r => r.point.id === p.id);
      const isMeasured = measured.has(p.id);

      if (isResult) {
        ctx.fillStyle = '#4ade80';
      } else if (isMeasured) {
        ctx.fillStyle = '#fbbf24';
      } else {
        ctx.fillStyle = '#4da6ff';
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // Query point
    ctx.fillStyle = '#ff4444';
    ctx.beginPath();
    ctx.arc(queryPoint.x, queryPoint.y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#cc0000';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [canvasRef, measured, points, queryPoint, radius, results]);

  return null;
}
