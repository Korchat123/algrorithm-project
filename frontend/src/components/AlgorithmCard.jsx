import { Link } from 'react-router-dom';

export function AlgorithmCard({ algorithm }) {
  return (
    <Link className="algorithm-card" to={`/algorithms/${algorithm.slug}`}>
      <span>{algorithm.category}</span>
      <h3>{algorithm.name}</h3>
      <p>{algorithm.summary}</p>
      <dl>
        <div><dt>Average</dt><dd>{algorithm.bigO.average}</dd></div>
        <div><dt>Space</dt><dd>{algorithm.bigO.space}</dd></div>
      </dl>
    </Link>
  );
}
