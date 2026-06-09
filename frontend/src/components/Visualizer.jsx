import { useEffect, useRef } from 'react';

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

function VectorVisualizer({ step }) {
  const points = step?.points || [];
  const query = step?.query;
  const measured = new Set(step?.measured || []);
  const nearest = new Set(step?.nearest || []);
  const compareTo = new Set(step?.compareTo || []);

  return (
    <div className="knn-stage vector-search-stage">
      <div className="knn-map">
        <span className="axis-label x-axis">vector feature 1</span>
        <span className="axis-label y-axis">vector feature 2</span>
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
            <small>query</small>
          </span>
        )}
      </div>
      <div className="knn-explanation">
        <strong>{step?.phase || 'Vector map'}</strong>
        <p>{step?.detail || 'Press Play to convert text into vectors and rank the most similar items.'}</p>
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

function VectorIndexRow({ item, query, tone }) {
  const similarity = query ? cosineSimilarity(item.vector, query.vector) : null;

  return (
    <div className={`vector-index-row ${tone || ''}`}>
      <span>{item.raw}</span>
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
