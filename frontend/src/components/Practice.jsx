import { useState } from 'react';
import { Trophy } from 'lucide-react';
import { useAuth } from '../contexts/useAuth.js';

export function Practice({ algorithm }) {
  const { auth } = useAuth();
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState('');
  const expected = algorithm.bigO.average;

  const submit = () => {
    const ok = answer.trim().toLowerCase() === expected.toLowerCase();
    setResult(ok ? 'Correct. Score +10.' : `Try again. Expected ${expected}.`);
  };

  return (
    <div className="practice">
      <h3><Trophy size={18} />Test understanding</h3>
      <p>What is the average time complexity?</p>
      <div className="choice-row">
        {[expected, algorithm.bigO.worst, 'O(1)'].map((choice) => (
          <button key={choice} className={answer === choice ? 'selected' : ''} onClick={() => setAnswer(choice)}>{choice}</button>
        ))}
      </div>
      <button onClick={submit}>Submit answer</button>
      <span>{result || (auth ? 'Logged-in users can save scores through the API.' : 'Log in to save progress.')}</span>
    </div>
  );
}
