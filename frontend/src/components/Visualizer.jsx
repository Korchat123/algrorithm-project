import { useEffect, useMemo, useRef, useState } from 'react';

export function Visualizer({ algorithm, values, step, target }) {
  if (algorithm.category === 'graph') {
    return <GraphVisualizer algorithm={algorithm} step={step} />;
  }
  if (algorithm.category === 'machine-learning') {
    if (algorithm.slug === 'knn') {
      return <KnnVisualizer step={step} />;
    }
    return <VectorVisualizer step={step} />;
  }

  if (algorithm.category === 'search') {
    return <SearchVisualizer algorithm={algorithm} values={values} step={step} target={target} />;
  }

  if (algorithm.category === 'sort') {
    if (algorithm.slug === 'bucket-sort') {
      return <BucketSortVisualizer step={step} />;
    }
    if (algorithm.slug === 'merge-sort') {
      return <MergeSortVisualizer values={values} step={step} />;
    }
    if (algorithm.slug === 'heap-sort') {
      return <HeapSortVisualizer values={values} step={step} />;
    }
    return <SortVisualizer values={values} step={step} />;
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

function SortVisualizer({ values, step }) {
  const displayItems = step?.items || values.map((value, index) => ({ id: `fallback-${index}`, value }));
  const active = new Set(step?.active || []);
  const swapped = new Set(step?.swapped || []);
  const sorted = new Set(step?.sorted || []);
  const itemCount = displayItems.length || 1;
  const swapLeft = step?.swap?.left;
  const swapRight = step?.swap?.right;
  const partition = step?.partition;
  const partitionStart = Math.max(0, partition?.start ?? 0);
  const partitionEnd = Math.min(itemCount - 1, partition?.end ?? -1);
  const hasPartition = partition && partitionEnd >= partitionStart;
  const pivotIndex = Number.isInteger(partition?.pivotIndex) ? partition.pivotIndex : step?.marker;
  const pivotValue = partition?.pivotValue ?? displayItems[pivotIndex]?.value;

  return (
    <div className="sort-stage">
      <div className="sort-box-row" style={{ '--item-count': itemCount }}>
        {hasPartition && (
          <span
            className="sort-partition-frame"
            style={{
              left: `${(partitionStart / itemCount) * 100}%`,
              width: `${((partitionEnd - partitionStart + 1) / itemCount) * 100}%`
            }}
          >
            <em>partition</em>
          </span>
        )}
        {displayItems.map((item, index) => (
          <span
            className={`sort-box ${active.has(index) ? 'active' : ''} ${swapped.has(index) ? 'swapped' : ''} ${swapLeft === index ? 'swap-left' : ''} ${swapRight === index ? 'swap-right' : ''} ${sorted.has(index) ? 'sorted' : ''} ${step?.marker === index ? 'marker' : ''}`}
            key={item.id}
            style={{ left: `${((index + 0.5) / itemCount) * 100}%` }}
          >
            <strong>{item.value}</strong>
            <small>i {index}</small>
          </span>
        ))}
        {hasPartition && Number.isInteger(pivotIndex) && (
          <span
            className="sort-pivot-pointer"
            style={{ left: `${((pivotIndex + 0.5) / itemCount) * 100}%` }}
          >
            <em>pivot</em>
            <strong>{pivotValue}</strong>
          </span>
        )}
      </div>
      <div className="sort-explanation">
        <strong>{step?.phase || 'Sort boxes'}</strong>
        <p>{step?.detail || 'Press Play to watch the numbered boxes move into sorted order.'}</p>
      </div>
    </div>
  );
}

function BucketSortVisualizer({ step }) {
  const buckets = step?.buckets || [];
  const output = step?.output || [];
  const activeBucket = step?.activeBucket;
  const activeItem = step?.activeItem;

  return (
    <div className="bucket-stage">
      <div className="bucket-grid" style={{ '--bucket-count': Math.max(buckets.length, 1) }}>
        {buckets.map((bucket, index) => (
          <section className={`bucket-column ${activeBucket === index ? 'active' : ''}`} key={`bucket-${index}`}>
            <header>
              <strong>Bucket {index + 1}</strong>
              <span>{bucket.length} item{bucket.length === 1 ? '' : 's'}</span>
            </header>
            <div className="bucket-items">
              {bucket.length ? bucket.map((item) => (
                <span
                  className={`bucket-token ${activeItem === item.id ? 'active' : ''}`}
                  key={item.id}
                >
                  {item.value}
                </span>
              )) : <em>Empty</em>}
            </div>
          </section>
        ))}
      </div>
      <div className="bucket-output">
        <strong>Output</strong>
        <div className="bucket-output-row">
          {output.length ? output.map((item) => (
            <span className={`bucket-token output ${activeItem === item.id ? 'active' : ''}`} key={`out-${item.id}`}>
              {item.value}
            </span>
          )) : <em>Numbers will collect here after buckets are sorted.</em>}
        </div>
      </div>
      <div className="bucket-explanation">
        <strong>{step?.phase || 'Bucket sort'}</strong>
        <p>{step?.detail || 'Press Play to place numbers into buckets, sort inside each bucket, and collect the final order.'}</p>
      </div>
    </div>
  );
}

function MergeSortVisualizer({ values, step }) {
  const fallbackRow = [{
    mode: 'split',
    label: 'Start',
    groups: [values.map((value, index) => ({ id: `fallback-${index}`, value }))]
  }];
  const rows = step?.mergeRows || fallbackRow;
  const activeRow = step?.activeMergeRow ?? 0;

  return (
    <div className="merge-stage">
      <div className="merge-tree">
        {rows.map((row, rowIndex) => (
          <div
            className={`merge-row ${row.mode} ${activeRow === rowIndex ? 'active' : ''}`}
            key={`${row.mode}-${rowIndex}`}
          >
            <span className="merge-row-label">{row.label}</span>
            <div className="merge-groups">
              {row.groups.map((group, groupIndex) => (
                <div className="merge-group" key={`${row.mode}-${rowIndex}-${groupIndex}`}>
                  {group.map((item) => (
                    <span className="merge-item" key={item.id}>{item.value}</span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="merge-explanation">
        <strong>{step?.phase || 'Merge sort'}</strong>
        <p>{step?.detail || 'Press Play to split the array into single numbers, then merge sorted boxes back together.'}</p>
      </div>
    </div>
  );
}

function HeapSortVisualizer({ values, step }) {
  const items = step?.heapItems || values.map((value, index) => ({ id: `fallback-${index}`, value }));
  const heapSize = Number.isInteger(step?.heapSize) ? step.heapSize : items.length;
  const active = new Set(step?.active || []);
  const swapped = new Set(step?.swapped || []);
  const sorted = new Set(step?.sorted || []);
  const positions = getHeapNodePositions(items.length);
  const edges = items.slice(1, heapSize).map((_, index) => {
    const childIndex = index + 1;
    return [Math.floor((childIndex - 1) / 2), childIndex];
  });

  return (
    <div className="heap-stage">
      <div className="heap-tree">
        <svg className="heap-lines" viewBox="0 0 100 100" aria-hidden="true" preserveAspectRatio="none">
          {edges.map(([parent, child]) => (
            <line
              className={`heap-line ${active.has(parent) && active.has(child) ? 'active' : ''}`}
              key={`${parent}-${child}`}
              x1={positions[parent].x}
              x2={positions[child].x}
              y1={positions[parent].y}
              y2={positions[child].y}
            />
          ))}
        </svg>
        {items.slice(0, heapSize).map((item, index) => (
          <span
            className={`heap-node ${active.has(index) ? 'active' : ''} ${swapped.has(index) ? 'swapped' : ''}`}
            key={item.id}
            style={{ left: `${positions[index].x}%`, top: `${positions[index].y}%` }}
          >
            <strong>{item.value}</strong>
            <small>i {index}</small>
          </span>
        ))}
        {!heapSize && <span className="heap-empty">Heap is empty</span>}
      </div>
      <div className="heap-array-row">
        <strong>Array</strong>
        <div className="heap-array-items">
          {items.map((item, index) => (
            <span
              className={`heap-array-item ${index < heapSize ? 'in-heap' : ''} ${active.has(index) ? 'active' : ''} ${sorted.has(index) ? 'sorted' : ''}`}
              key={`array-${item.id}`}
            >
              <em>{index}</em>
              {item.value}
            </span>
          ))}
        </div>
      </div>
      <div className="heap-explanation">
        <strong>{step?.phase || 'Heap sort'}</strong>
        <p>{step?.detail || 'Press Play to build a max heap, move the root into the sorted output, and restore the heap.'}</p>
      </div>
    </div>
  );
}

function getHeapNodePositions(count) {
  if (!count) return [];
  const levels = Math.floor(Math.log2(count)) + 1;
  const verticalGap = levels <= 1 ? 0 : 68 / (levels - 1);

  return Array.from({ length: count }, (_, index) => {
    const level = Math.floor(Math.log2(index + 1));
    const levelStart = (2 ** level) - 1;
    const levelIndex = index - levelStart;
    const nodesInLevel = Math.min(2 ** level, count - levelStart);

    return {
      x: ((levelIndex + 1) / (nodesInLevel + 1)) * 100,
      y: 12 + (level * verticalGap)
    };
  });
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

const emptyVectorPoints = [];

function VectorVisualizer({ step }) {
  const points = step?.points || emptyVectorPoints;
  const query = step?.query;
  const measured = new Set(step?.measured || []);
  const nearest = new Set(step?.nearest || []);
  const compareTo = new Set(step?.compareTo || []);
  const dragRef = useRef(null);
  const [view, setView] = useState({
    yaw: -32,
    pitch: 18,
    roll: 0,
    zoom: 1,
    panX: 0,
    panY: 0
  });
  const scene = useMemo(() => {
    const items = [
      ...points.map((point) => ({ ...point, kind: 'point' })),
      ...(query ? [{ ...query, kind: 'query' }] : [])
    ];
    return projectVectorScene(items, view);
  }, [points, query, view]);
  const projectedPoints = points
    .map((point) => scene.items.find((item) => item.id === point.id))
    .filter(Boolean);
  const projectedQuery = query ? scene.items.find((item) => item.id === query.id) : null;

  function handlePointerDown(event) {
    dragRef.current = {
      x: event.clientX,
      y: event.clientY,
      mode: event.shiftKey ? 'pan' : 'rotate'
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event) {
    if (!dragRef.current) return;
    const dx = event.clientX - dragRef.current.x;
    const dy = event.clientY - dragRef.current.y;
    dragRef.current.x = event.clientX;
    dragRef.current.y = event.clientY;

    setView((current) => {
      if (dragRef.current.mode === 'pan') {
        return {
          ...current,
          panX: current.panX + dx * 0.12,
          panY: current.panY + dy * 0.12
        };
      }

      return {
        ...current,
        yaw: current.yaw + dx * 0.45,
        pitch: Math.max(-80, Math.min(80, current.pitch - dy * 0.35))
      };
    });
  }

  function handlePointerUp(event) {
    dragRef.current = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  }

  function handleWheel(event) {
    event.preventDefault();
    setView((current) => ({
      ...current,
      zoom: Math.max(0.55, Math.min(2.25, current.zoom - event.deltaY * 0.0012))
    }));
  }

  return (
    <div className="knn-stage vector-search-stage">
      <div className="vector-space-toolbar">
        <span>8D projection</span>
        <button type="button" onClick={() => setView((current) => ({ ...current, zoom: Math.min(2.25, current.zoom + 0.15) }))}>Zoom in</button>
        <button type="button" onClick={() => setView((current) => ({ ...current, zoom: Math.max(0.55, current.zoom - 0.15) }))}>Zoom out</button>
        <button type="button" onClick={() => setView({ yaw: -32, pitch: 18, roll: 0, zoom: 1, panX: 0, panY: 0 })}>Reset</button>
      </div>
      <div
        className="vector-space-map"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
      >
        <svg className="vector-space-lines" viewBox="0 0 100 100" aria-hidden="true">
          {projectedQuery && step?.searchMode === 'radius' && (
            <circle
              className="vector-radius-ring"
              cx={projectedQuery.x}
              cy={projectedQuery.y}
              r={18 + Number(step.radius || 0) * 18}
            />
          )}
          {scene.axes.map((axis) => (
            <g className={`vector-axis vector-axis-${axis.index + 1}`} key={axis.label}>
              <line x1={axis.from.x} x2={axis.to.x} y1={axis.from.y} y2={axis.to.y} />
              <text x={axis.to.x} y={axis.to.y}>{axis.label}</text>
            </g>
          ))}
          {scene.shells.map((shell) => (
            <polyline className={`vector-shell ${shell.tone}`} key={shell.id} points={shell.points.map((point) => `${point.x},${point.y}`).join(' ')} />
          ))}
          {projectedQuery && points.map((point) => {
            const projectedPoint = scene.items.find((item) => item.id === point.id);
            const isMeasured = measured.has(point.id);
            const isNearest = nearest.has(point.id);
            const isActive = step?.activePoint === point.id;
            const isCompared = compareTo.has(point.id);
            if (!projectedPoint || (!isMeasured && !isNearest && !isActive && !isCompared)) return null;
            return (
              <line
                className={`knn-line ${isCompared ? 'compared' : ''} ${isNearest ? 'nearest' : ''} ${isActive ? 'active' : ''}`}
                key={point.id}
                x1={projectedQuery.x}
                x2={projectedPoint.x}
                y1={projectedQuery.y}
                y2={projectedPoint.y}
              />
            );
          })}
        </svg>
        <div className="vector-space-help">
          Drag to rotate. Shift-drag to pan. Wheel to zoom.
        </div>
        {projectedPoints
          .sort((a, b) => a.depth - b.depth)
          .map((point) => (
          <span
            className={`knn-point vector-point ${measured.has(point.id) ? 'measured' : ''} ${nearest.has(point.id) ? 'nearest' : ''} ${step?.activePoint === point.id ? 'active' : ''}`}
            key={point.id}
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
          >
            <strong>{point.raw}</strong>
            <small>{point.label}</small>
          </span>
        ))}
        {projectedQuery && (
          <span className="knn-point query vector-point" style={{ left: `${projectedQuery.x}%`, top: `${projectedQuery.y}%` }}>
            <strong>{projectedQuery.raw}</strong>
            <small>query</small>
          </span>
        )}
      </div>
      <div className="knn-explanation">
        <strong>{step?.phase || 'Vector map'}</strong>
        <p>{step?.detail || 'Press Play to convert text into vectors and rank the most similar items.'}</p>
        {step?.modeLabel && <span>Mode: {step.modeLabel}</span>}
        {step?.searchMode === 'radius' && <span>Radius threshold: cosine &gt;= {Number(step.radius || 0).toFixed(2)}</span>}
        {step?.searchMode === 'ann' && <span>Approximate mode: only candidate vectors are measured.</span>}
        {step?.prediction && <span>Top matches: {step.prediction}</span>}
      </div>
      <div className="vector-index">
        <strong>Vector index</strong>
        <div className="vector-index-grid">
          {query && <VectorIndexRow item={query} tone="query" />}
          {points.map((point) => <VectorIndexRow item={point} key={point.id} query={query} />)}
        </div>
      </div>
    </div>
  );
}

const vectorDimensionLabels = [
  'D1 x/self',
  'D2 y/people',
  'D3 z/emotion',
  'D4 big x/animal',
  'D5 big y/food',
  'D6 big z/vehicle',
  'D7 world x/place',
  'D8 world y/learning'
];

function projectVectorScene(items, view) {
  const origin = projectWorldPoint({ x: 0, y: 0, z: 0 }, view);
  const axes = vectorDimensionLabels.map((label, index) => {
    const vector = Array.from({ length: 8 }, (_, dim) => dim === index ? 1 : 0);
    return {
      index,
      label,
      from: origin,
      to: projectWorldPoint(vectorToWorld(vector), view)
    };
  });

  return {
    axes,
    shells: buildVectorShells(view),
    items: items.map((item) => ({
      ...item,
      ...projectWorldPoint(vectorToWorld(item.vector), view)
    }))
  };
}

function vectorToWorld(vector = []) {
  const values = Array.from({ length: 8 }, (_, index) => Number(vector[index] || 0));
  return {
    x: (values[0] * 30) + (values[3] * 46) + (values[6] * 68),
    y: -(values[1] * 30) - (values[4] * 46) - (values[7] * 68),
    z: (values[2] * 30) + (values[5] * 46)
  };
}

function projectWorldPoint(point, view) {
  const yaw = toRadians(view.yaw);
  const pitch = toRadians(view.pitch);
  const roll = toRadians(view.roll);

  let x = point.x;
  let y = point.y;
  let z = point.z;

  const yawX = (x * Math.cos(yaw)) - (z * Math.sin(yaw));
  const yawZ = (x * Math.sin(yaw)) + (z * Math.cos(yaw));
  x = yawX;
  z = yawZ;

  const pitchY = (y * Math.cos(pitch)) - (z * Math.sin(pitch));
  const pitchZ = (y * Math.sin(pitch)) + (z * Math.cos(pitch));
  y = pitchY;
  z = pitchZ;

  const rollX = (x * Math.cos(roll)) - (y * Math.sin(roll));
  const rollY = (x * Math.sin(roll)) + (y * Math.cos(roll));
  x = rollX;
  y = rollY;

  return {
    x: Math.max(-20, Math.min(120, 50 + view.panX + (x * view.zoom * 0.62))),
    y: Math.max(-20, Math.min(120, 50 + view.panY + (y * view.zoom * 0.62))),
    depth: z
  };
}

function buildVectorShells(view) {
  const local = [
    [0, 0, 0],
    [30, 0, 0],
    [30, -30, 0],
    [0, -30, 0],
    [0, 0, 0],
    [0, 0, 30],
    [30, 0, 30],
    [30, -30, 30],
    [0, -30, 30],
    [0, 0, 30]
  ];
  const big = [
    [0, 0, 0],
    [46, 0, 0],
    [46, -46, 0],
    [0, -46, 0],
    [0, 0, 0],
    [0, 0, 46],
    [46, 0, 46],
    [46, -46, 46],
    [0, -46, 46],
    [0, 0, 46]
  ];
  const world = [
    [0, 0, 0],
    [68, 0, 0],
    [68, -68, 0],
    [0, -68, 0],
    [0, 0, 0]
  ];

  return [
    { id: 'local-shell', tone: 'local', source: local },
    { id: 'big-shell', tone: 'big', source: big },
    { id: 'world-shell', tone: 'world', source: world }
  ].map((shell) => ({
    ...shell,
    points: shell.source.map(([x, y, z]) => projectWorldPoint({ x, y, z }, view))
  }));
}

function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

function VectorIndexRow({ item, query, tone }) {
  const similarity = query ? cosineSimilarity(item.vector, query.vector) : null;

  return (
    <div className={`vector-index-row ${tone || ''}`}>
      <span>{item.raw}<small>{item.label}</small></span>
      <code>[{item.vector.map((value) => Number(value.toFixed(2))).join(', ')}]</code>
      {Number.isFinite(similarity) && <em>cos {similarity.toFixed(2)}</em>}
    </div>
  );
}

function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, value, index) => sum + value * b[index], 0);
  const magnitude = Math.hypot(...a) * Math.hypot(...b);
  return magnitude ? dot / magnitude : 0;
}

function KnnVisualizer({ step }) {
  const points = step?.points || [];
  const query = step?.query;
  const measured = new Set(step?.measured || []);
  const nearest = new Set(step?.nearest || []);
  const compareTo = new Set(step?.compareTo || []);

  return (
    <div className="knn-stage">
      <div className="knn-map">
        <span className="axis-label x-axis">feature 1</span>
        <span className="axis-label y-axis">feature 2</span>
        <svg className="knn-lines" viewBox="0 0 100 100" aria-hidden="true" preserveAspectRatio="none">
          {query && points.map((point) => {
            const isMeasured = measured.has(point.id);
            const isNearest = nearest.has(point.id);
            const isActive = step?.activePoint === point.id;
            const isCompared = compareTo.has(point.id);
            if (!isMeasured && !isNearest && !isActive && !isCompared) return null;
            return (
              <line
                className={`knn-line ${isCompared ? 'compared' : ''} ${isNearest ? 'nearest' : ''} ${isActive ? 'active' : ''}`}
                key={point.id}
                x1={query.x}
                x2={point.x}
                y1={query.y}
                y2={point.y}
              />
            );
          })}
        </svg>
        {points.map((point) => (
          <span
            className={`knn-point ${measured.has(point.id) ? 'measured' : ''} ${nearest.has(point.id) ? 'nearest' : ''} ${step?.activePoint === point.id ? 'active' : ''}`}
            key={point.id}
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
          >
            <strong>{point.raw}</strong>
            <small>{point.label}</small>
          </span>
        ))}
        {query && (
          <span className="knn-point query" style={{ left: `${query.x}%`, top: `${query.y}%` }}>
            <strong>{query.raw}</strong>
            <small>target</small>
          </span>
        )}
      </div>
      <div className="knn-explanation">
        <strong>{step?.phase || 'KNN map'}</strong>
        <p>{step?.detail || 'Press Play to map your data and compare each point to the target.'}</p>
        {step?.prediction && <span>Result: {step.prediction}</span>}
      </div>
    </div>
  );
}
