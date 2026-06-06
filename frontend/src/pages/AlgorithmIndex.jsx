import { useMemo } from 'react';
import { algorithms } from '../assets/algorithms.js';
import { AlgorithmCard } from '../components/AlgorithmCard.jsx';

export function AlgorithmIndex() {
  const grouped = useMemo(() => {
    return algorithms.reduce((acc, algorithm) => {
      acc[algorithm.category] = [...(acc[algorithm.category] || []), algorithm];
      return acc;
    }, {});
  }, []);

  return (
    <section className="page">
      <div className="page-heading">
        <p className="eyebrow">Algorithm pages</p>
        <h1>Choose an algorithm</h1>
      </div>
      {Object.entries(grouped).map(([category, items]) => (
        <section key={category} className="algorithm-section">
          <h2>{category.replace('-', ' ')}</h2>
          <div className="algorithm-grid">
            {items.map((algorithm) => (
              <AlgorithmCard algorithm={algorithm} key={algorithm.slug} />
            ))}
          </div>
        </section>
      ))}
    </section>
  );
}
