import { ArrowDownUp, Check, CircleHelp, Play, RefreshCw, Target, Timer, Trophy } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const numberPool = [42, 7, 19, 3, 31, 12];
const wordPool = ['mango', 'apple', 'grape', 'kiwi', 'banana', 'pear'];
const quickSortPool = [29, 11, 45, 6, 18, 33, 24];
const hanoiStart = [[4, 3, 2, 1], [], []];

function formatTime(seconds) {
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

function isSorted(items, type = 'number') {
  return items.every((item, index) => {
    if (index === 0) return true;
    return type === 'text' ? items[index - 1].localeCompare(item) <= 0 : items[index - 1] <= item;
  });
}

function useTimer(active) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!active) return undefined;
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [active]);

  return [seconds, setSeconds];
}

function SortRace() {
  const [type, setType] = useState('number');
  const [items, setItems] = useState(numberPool);
  const [selected, setSelected] = useState(null);
  const [moves, setMoves] = useState(0);
  const complete = isSorted(items, type);
  const [seconds, setSeconds] = useTimer(!complete);

  function reset(nextType = type) {
    setType(nextType);
    setItems(nextType === 'text' ? wordPool : numberPool);
    setSelected(null);
    setMoves(0);
    setSeconds(0);
  }

  function choose(index) {
    if (complete) return;
    if (selected === null) {
      setSelected(index);
      return;
    }
    if (selected === index) {
      setSelected(null);
      return;
    }
    setItems((current) => {
      const next = [...current];
      [next[selected], next[index]] = [next[index], next[selected]];
      return next;
    });
    setMoves((value) => value + 1);
    setSelected(null);
  }

  return (
    <article className="play-panel">
      <div className="game-header">
        <div>
          <p className="eyebrow">Game 1</p>
          <h2>Sort race</h2>
        </div>
        <Trophy />
      </div>
      <div className="game-toolbar">
        <button className={type === 'number' ? 'selected' : ''} onClick={() => reset('number')}>Numbers</button>
        <button className={type === 'text' ? 'selected' : ''} onClick={() => reset('text')}>Text</button>
        <button onClick={() => reset()}><RefreshCw size={16} />Reset</button>
      </div>
      <div className="metric-row">
        <span><Timer size={16} />{formatTime(seconds)}</span>
        <span><ArrowDownUp size={16} />{moves} swaps</span>
      </div>
      <div className="sort-board">
        {items.map((item, index) => (
          <button
            className={`sort-token ${selected === index ? 'selected' : ''} ${complete ? 'done' : ''}`}
            key={`${item}-${index}`}
            onClick={() => choose(index)}
          >
            {item}
          </button>
        ))}
      </div>
      <p className="game-status">{complete ? `Sorted in ${formatTime(seconds)} with ${moves} swaps.` : 'Pick two tiles to swap them into ascending order.'}</p>
    </article>
  );
}

function GuessGame() {
  const [target, setTarget] = useState(37);
  const [guess, setGuess] = useState('');
  const [hint, setHint] = useState('Ask with a number from 1 to 100.');
  const [steps, setSteps] = useState(0);
  const [done, setDone] = useState(false);
  const [seconds, setSeconds] = useTimer(!done);

  function reset() {
    setTarget(Math.floor(Math.random() * 100) + 1);
    setGuess('');
    setHint('Ask with a number from 1 to 100.');
    setSteps(0);
    setDone(false);
    setSeconds(0);
  }

  function ask(event) {
    event.preventDefault();
    const value = Number(guess);
    if (!Number.isInteger(value) || value < 1 || value > 100 || done) return;
    setSteps((count) => count + 1);
    if (value === target) {
      setHint(`Correct. The target was ${target}.`);
      setDone(true);
    } else {
      setHint(value < target ? 'More. The hidden number is higher.' : 'Less. The hidden number is lower.');
    }
    setGuess('');
  }

  return (
    <article className="play-panel">
      <div className="game-header">
        <div>
          <p className="eyebrow">Game 2</p>
          <h2>More or less</h2>
        </div>
        <CircleHelp />
      </div>
      <div className="metric-row">
        <span><Timer size={16} />{formatTime(seconds)}</span>
        <span><Target size={16} />{steps} asks</span>
      </div>
      <form className="guess-form" onSubmit={ask}>
        <input
          min="1"
          max="100"
          onChange={(event) => setGuess(event.target.value)}
          placeholder="Your ask"
          type="number"
          value={guess}
        />
        <button><Play size={16} />Ask</button>
      </form>
      <div className={`hint-box ${done ? 'done' : ''}`}>{hint}</div>
      <button className="wide-button" onClick={reset}><RefreshCw size={16} />New number</button>
    </article>
  );
}

function HanoiGame() {
  const [towers, setTowers] = useState(hanoiStart);
  const [active, setActive] = useState(null);
  const [moves, setMoves] = useState(0);
  const complete = towers[2].length === 4;
  const [seconds, setSeconds] = useTimer(!complete);

  function reset() {
    setTowers(hanoiStart);
    setActive(null);
    setMoves(0);
    setSeconds(0);
  }

  function chooseTower(index) {
    if (complete) return;
    if (active === null) {
      if (towers[index].length > 0) setActive(index);
      return;
    }
    if (active === index) {
      setActive(null);
      return;
    }
    const disk = towers[active][towers[active].length - 1];
    const targetTop = towers[index][towers[index].length - 1];
    if (targetTop && targetTop < disk) return;
    setTowers((current) => current.map((tower, towerIndex) => {
      if (towerIndex === active) return tower.slice(0, -1);
      if (towerIndex === index) return [...tower, disk];
      return tower;
    }));
    setMoves((value) => value + 1);
    setActive(null);
  }

  return (
    <article className="play-panel">
      <div className="game-header">
        <div>
          <p className="eyebrow">Game 3</p>
          <h2>Tower of Hanoi</h2>
        </div>
        <ArrowDownUp />
      </div>
      <div className="metric-row">
        <span><Timer size={16} />{formatTime(seconds)}</span>
        <span><Target size={16} />{moves} moves</span>
      </div>
      <div className="hanoi-board">
        {towers.map((tower, index) => (
          <button className={`tower ${active === index ? 'selected' : ''}`} key={index} onClick={() => chooseTower(index)}>
            <span className="tower-pole" />
            {tower.map((disk) => <span className={`disk disk-${disk}`} key={disk}>{disk}</span>)}
          </button>
        ))}
      </div>
      <p className="game-status">{complete ? `Solved in ${moves} moves. Best possible is 15.` : 'Move one top disk at a time. A larger disk cannot sit on a smaller disk.'}</p>
      <button className="wide-button" onClick={reset}><RefreshCw size={16} />Reset tower</button>
    </article>
  );
}

function BuildSortedGame() {
  const [source, setSource] = useState(quickSortPool);
  const [answer, setAnswer] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const complete = answer.length === quickSortPool.length && isSorted(answer);
  const next = useMemo(() => [...source].sort((a, b) => a - b)[0], [source]);
  const [seconds, setSeconds] = useTimer(!complete);

  function reset() {
    setSource(quickSortPool);
    setAnswer([]);
    setMistakes(0);
    setSeconds(0);
  }

  function pick(value) {
    if (complete) return;
    if (value !== next) {
      setMistakes((count) => count + 1);
      return;
    }
    setSource((current) => current.filter((item) => item !== value));
    setAnswer((current) => [...current, value]);
  }

  return (
    <article className="play-panel">
      <div className="game-header">
        <div>
          <p className="eyebrow">Game 4</p>
          <h2>Build the sorted list</h2>
        </div>
        <Check />
      </div>
      <div className="metric-row">
        <span><Timer size={16} />{formatTime(seconds)}</span>
        <span><Target size={16} />{mistakes} mistakes</span>
      </div>
      <div className="source-row">
        {source.map((item) => <button className="sort-token" key={item} onClick={() => pick(item)}>{item}</button>)}
      </div>
      <div className="answer-row">
        {answer.length === 0 ? <span>Pick the smallest remaining item first.</span> : answer.map((item) => <strong key={item}>{item}</strong>)}
      </div>
      <p className="game-status">{complete ? `Finished in ${formatTime(seconds)} with ${mistakes} mistakes.` : 'Choose the next smallest tile to build a sorted list.'}</p>
      <button className="wide-button" onClick={reset}><RefreshCw size={16} />Reset list</button>
    </article>
  );
}

export function Games() {
  return (
    <section className="page games-page">
      <div className="page-heading">
        <p className="eyebrow">Practice modes</p>
        <h1>Algorithm games</h1>
        <p>Sort under time pressure, search with hints, and solve recursive movement puzzles.</p>
      </div>
      <div className="play-grid">
        <SortRace />
        <GuessGame />
        <HanoiGame />
        <BuildSortedGame />
      </div>
    </section>
  );
}
