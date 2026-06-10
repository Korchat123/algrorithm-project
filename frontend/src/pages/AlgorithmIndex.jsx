import { useEffect, useMemo, useState } from 'react';
import { AlgorithmCard } from '../components/AlgorithmCard.jsx';
import { fallbackAlgorithms, fetchAlgorithms } from '../utils/algorithmData.js';

export function AlgorithmIndex() {
  const [algorithms, setAlgorithms] = useState(fallbackAlgorithms);

  useEffect(() => {
    let active = true;
    fetchAlgorithms()
      .then((items) => {
        if (active) setAlgorithms(items);
      })
      .catch(() => {
        if (active) setAlgorithms(fallbackAlgorithms);
      });
    return () => {
      active = false;
    };
  }, []);

  const grouped = useMemo(() => {
    return algorithms.reduce((acc, algorithm) => {
      acc[algorithm.category] = [...(acc[algorithm.category] || []), algorithm];
      return acc;
    }, {});
  }, [algorithms]);

  return (
    <section className="page">
      <div className="page-heading">
        <p className="eyebrow">Algorithm pages</p>
        <h1>Choose an algorithm</h1>
        <p>
          An algorithm is a clear step-by-step method for solving a problem or
          completing a task. In programming, algorithms describe exactly how data
          should be searched, sorted, grouped, transformed, or analyzed.
        </p>
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
