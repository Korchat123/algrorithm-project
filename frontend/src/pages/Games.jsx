import { ArrowDownUp, Check, CircleHelp, Play, RefreshCw, Search, Target, Timer, Trophy } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/useAuth.js';
import { api } from '../utils/api.js';

function formatTime(seconds) {
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

function isSorted(items, type = 'number') {
  return items.every((item, index) => {
    if (index === 0) return true;
    return type === 'text' ? items[index - 1].localeCompare(item) <= 0 : items[index - 1] <= item;
  });
}

function useTimer(active, initialTime = 0, isCountdown = false) {
  const [seconds, setSeconds] = useState(initialTime);

  useEffect(() => {
    if (!active) return undefined;
    const timer = window.setInterval(() => {
      setSeconds((value) => {
        if (isCountdown) return Math.max(0, value - 1);
        return value + 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [active, isCountdown]);

  return [seconds, setSeconds];
}

const LEVEL_OPTIONS = [1, 2, 3, 4, 5];
const GAME_TITLES = {
  sort: 'Sort Race',
  guess: 'More or Less',
  hanoi: 'Tower of Hanoi',
  build: 'Build Sorted List',
  hidden: 'Find Hidden Number'
};

function GameHeader({ level, mode, onLevelChange, onModeChange, title, icon: Icon }) {
  const levelId = `${title.replace(/\s+/g, '-').toLowerCase()}-level`;

  return (
    <div className="game-header-controls">
      <div className="game-header">
        <div>
          <p className="eyebrow">Level {level}</p>
          <h2>{title} {mode === 'time-attack' && '(Time Attack)'}</h2>
        </div>
        <Icon />
      </div>
      <div className="game-toolbar">
        <label className="sr-only" htmlFor={levelId}>Level</label>
        <select id={levelId} value={level} onChange={(e) => onLevelChange(Number(e.target.value))}>
          {LEVEL_OPTIONS.map(l => <option key={l} value={l}>Level {l}</option>)}
        </select>
        <button 
          className={mode === 'standard' ? 'selected' : ''} 
          onClick={() => onModeChange('standard')}
        >
          Standard
        </button>
        <button 
          className={mode === 'time-attack' ? 'selected' : ''} 
          onClick={() => onModeChange('time-attack')}
        >
          Time Attack
        </button>
      </div>
    </div>
  );
}

function SortRace({ level, mode, onComplete, onLevelChange, onModeChange }) {
  const size = 4 + (level * 2);
  const type = level === 3 ? 'text' : 'number';
  
  function generateItems() {
    if (type === 'text') {
      const words = ['mango', 'apple', 'grape', 'kiwi', 'banana', 'pear', 'cherry', 'date', 'plum', 'fig'];
      return words.slice(0, size).sort(() => Math.random() - 0.5);
    }
    return Array.from({ length: size }, () => Math.floor(Math.random() * 100)).sort(() => Math.random() - 0.5);
  }

  const [items, setItems] = useState(generateItems);
  const [selected, setSelected] = useState(null);
  const [moves, setMoves] = useState(0);
  const [started, setStarted] = useState(false);
  const [saved, setSaved] = useState(false);
  const complete = isSorted(items, type);
  
  const initialTime = mode === 'time-attack' ? 60 - (level * 5) : 0;
  const [seconds, setSeconds] = useTimer(started && !complete, initialTime, mode === 'time-attack');
  const failed = mode === 'time-attack' && seconds === 0 && !complete;

  useEffect(() => {
    reset();
  }, [level, mode]);

  function reset() {
    setItems(generateItems());
    setSelected(null);
    setMoves(0);
    setStarted(false);
    setSaved(false);
    setSeconds(initialTime);
  }

  function choose(index) {
    if (complete || failed) return;
    setStarted(true);
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

  useEffect(() => {
    if (!complete || saved || moves === 0) return;
    const timeSeconds = mode === 'time-attack' ? initialTime - seconds : seconds;
    setSaved(true);
    onComplete('sort', level, mode, timeSeconds, `${moves} swaps`);
  }, [complete, initialTime, level, mode, moves, onComplete, saved, seconds]);

  return (
    <article className={`play-panel ${failed ? 'failed' : ''}`}>
      <GameHeader 
        level={level} mode={mode} title="Sort race" icon={Trophy}
        onLevelChange={onLevelChange} onModeChange={onModeChange} 
      />
      <div className="metric-row">
        <span className={failed ? 'text-error' : ''}><Timer size={16} />{formatTime(seconds)}</span>
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
      <p className="game-status">
        {failed ? 'Time up! Try again.' : complete ? `Sorted in ${formatTime(mode === 'time-attack' ? initialTime - seconds : seconds)} with ${moves} swaps.` : 'Pick two tiles to swap them into ascending order.'}
      </p>
      {failed && <button className="wide-button" onClick={reset}><RefreshCw size={16} />Retry</button>}
    </article>
  );
}

function GuessGame({ level, mode, onComplete, onLevelChange, onModeChange }) {
  const range = [20, 50, 100, 500, 1000][level - 1];
  const [target, setTarget] = useState(() => Math.floor(Math.random() * range) + 1);
  const [guess, setGuess] = useState('');
  const [hint, setHint] = useState(`Ask with a number from 1 to ${range}.`);
  const [steps, setSteps] = useState(0);
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const initialTime = mode === 'time-attack' ? 45 - (level * 5) : 0;
  const [seconds, setSeconds] = useTimer(started && !done, initialTime, mode === 'time-attack');
  const failed = mode === 'time-attack' && seconds === 0 && !done;

  useEffect(() => {
    reset();
  }, [level, mode]);

  function reset() {
    setTarget(Math.floor(Math.random() * range) + 1);
    setGuess('');
    setHint(`Ask with a number from 1 to ${range}.`);
    setSteps(0);
    setDone(false);
    setStarted(false);
    setSaved(false);
    setSeconds(initialTime);
  }

  function ask(event) {
    event.preventDefault();
    const value = Number(guess);
    if (!Number.isInteger(value) || value < 1 || value > range || done || failed) return;
    setStarted(true);
    setSteps((count) => count + 1);
    if (value === target) {
      setHint(`Correct. The target was ${target}.`);
      setDone(true);
    } else {
      setHint(value < target ? 'More. The hidden number is higher.' : 'Less. The hidden number is lower.');
    }
    setGuess('');
  }

  useEffect(() => {
    if (!done || saved) return;
    const timeSeconds = mode === 'time-attack' ? initialTime - seconds : seconds;
    setSaved(true);
    onComplete('guess', level, mode, timeSeconds, `${steps} asks`);
  }, [done, initialTime, level, mode, onComplete, saved, seconds, steps]);

  return (
    <article className={`play-panel ${failed ? 'failed' : ''}`}>
      <GameHeader 
        level={level} mode={mode} title="More or less" icon={CircleHelp}
        onLevelChange={onLevelChange} onModeChange={onModeChange} 
      />
      <div className="metric-row">
        <span className={failed ? 'text-error' : ''}><Timer size={16} />{formatTime(seconds)}</span>
        <span><Target size={16} />{steps} asks</span>
      </div>
      <form className="guess-form" onSubmit={ask}>
        <input
          min="1"
          max={range}
          onChange={(event) => setGuess(event.target.value)}
          placeholder="Your ask"
          type="number"
          value={guess}
        />
        <button disabled={failed || done}><Play size={16} />Ask</button>
      </form>
      <div className={`hint-box ${done ? 'done' : failed ? 'failed' : ''}`}>{failed ? 'Time is up!' : hint}</div>
      <button className="wide-button" onClick={reset}><RefreshCw size={16} />New number</button>
    </article>
  );
}

function HanoiGame({ level, mode, onComplete, onLevelChange, onModeChange }) {
  const disks = 2 + level;
  const generateHanoi = () => {
    const d = Array.from({ length: disks }, (_, i) => disks - i);
    return [d, [], []];
  };

  const [towers, setTowers] = useState(generateHanoi);
  const [active, setActive] = useState(null);
  const [moves, setMoves] = useState(0);
  const [started, setStarted] = useState(false);
  const [saved, setSaved] = useState(false);
  const complete = towers[2].length === disks;

  const initialTime = mode === 'time-attack' ? 120 - (level * 15) : 0;
  const [seconds, setSeconds] = useTimer(started && !complete, initialTime, mode === 'time-attack');
  const failed = mode === 'time-attack' && seconds === 0 && !complete;

  useEffect(() => {
    reset();
  }, [level, mode]);

  function reset() {
    setTowers(generateHanoi());
    setActive(null);
    setMoves(0);
    setStarted(false);
    setSaved(false);
    setSeconds(initialTime);
  }

  function chooseTower(index) {
    if (complete || failed) return;
    if (active === null) {
      if (towers[index].length > 0) {
        setStarted(true);
        setActive(index);
      }
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

  useEffect(() => {
    if (!complete || saved || moves === 0) return;
    const timeSeconds = mode === 'time-attack' ? initialTime - seconds : seconds;
    setSaved(true);
    onComplete('hanoi', level, mode, timeSeconds, `${moves} moves`);
  }, [complete, initialTime, level, mode, moves, onComplete, saved, seconds]);

  return (
    <article className={`play-panel ${failed ? 'failed' : ''}`}>
      <GameHeader 
        level={level} mode={mode} title="Tower of Hanoi" icon={ArrowDownUp}
        onLevelChange={onLevelChange} onModeChange={onModeChange} 
      />
      <div className="metric-row">
        <span className={failed ? 'text-error' : ''}><Timer size={16} />{formatTime(seconds)}</span>
        <span><Target size={16} />{moves} moves</span>
      </div>
      <div className="hanoi-board">
        {towers.map((tower, index) => (
          <button className={`tower ${active === index ? 'selected' : ''}`} key={index} onClick={() => chooseTower(index)}>
            <span className="tower-pole" />
            {tower.map((disk) => (
              <span
                className="disk"
                key={disk}
                style={{ width: `${38 + ((disk - 1) / Math.max(disks - 1, 1)) * 48}%` }}
              >
                {disk}
              </span>
            ))}
          </button>
        ))}
      </div>
      <p className="game-status">{failed ? 'Out of time!' : complete ? `Solved in ${moves} moves.` : 'Move one top disk at a time.'}</p>
      <button className="wide-button" onClick={reset}><RefreshCw size={16} />Reset tower</button>
    </article>
  );
}

function BuildSortedGame({ level, mode, onComplete, onLevelChange, onModeChange }) {
  const size = 3 + (level * 2);
  const generateSource = () => Array.from({ length: size }, () => Math.floor(Math.random() * 100)).sort(() => Math.random() - 0.5);

  const [source, setSource] = useState(generateSource);
  const [answer, setAnswer] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [started, setStarted] = useState(false);
  const [saved, setSaved] = useState(false);
  const complete = answer.length === size && isSorted(answer);
  const next = useMemo(() => [...source].sort((a, b) => a - b)[0], [source]);

  const initialTime = mode === 'time-attack' ? 45 - (level * 5) : 0;
  const [seconds, setSeconds] = useTimer(started && !complete, initialTime, mode === 'time-attack');
  const failed = mode === 'time-attack' && seconds === 0 && !complete;

  useEffect(() => {
    reset();
  }, [level, mode]);

  function reset() {
    setSource(generateSource());
    setAnswer([]);
    setMistakes(0);
    setStarted(false);
    setSaved(false);
    setSeconds(initialTime);
  }

  function pick(value) {
    if (complete || failed) return;
    setStarted(true);
    if (value !== next) {
      setMistakes((count) => count + 1);
      return;
    }
    setSource((current) => current.filter((item) => item !== value));
    setAnswer((current) => [...current, value]);
  }

  useEffect(() => {
    if (!complete || saved) return;
    const timeSeconds = mode === 'time-attack' ? initialTime - seconds : seconds;
    setSaved(true);
    onComplete('build', level, mode, timeSeconds, `${mistakes} mistakes`);
  }, [complete, initialTime, level, mistakes, mode, onComplete, saved, seconds]);

  return (
    <article className={`play-panel ${failed ? 'failed' : ''}`}>
      <GameHeader 
        level={level} mode={mode} title="Build sorted list" icon={Check}
        onLevelChange={onLevelChange} onModeChange={onModeChange} 
      />
      <div className="metric-row">
        <span className={failed ? 'text-error' : ''}><Timer size={16} />{formatTime(seconds)}</span>
        <span><Target size={16} />{mistakes} mistakes</span>
      </div>
      <div className="source-row">
        {source.map((item, i) => <button className="sort-token" key={`${item}-${i}`} onClick={() => pick(item)}>{item}</button>)}
      </div>
      <div className="answer-row">
        {answer.length === 0 ? <span>Pick the smallest item.</span> : answer.map((item, i) => <strong key={`${item}-${i}`}>{item}</strong>)}
      </div>
      <p className="game-status">{failed ? 'Too slow!' : complete ? `Finished with ${mistakes} mistakes.` : 'Choose the next smallest tile.'}</p>
      <button className="wide-button" onClick={reset}><RefreshCw size={16} />Reset list</button>
    </article>
  );
}

function HiddenIndexGame({ level, mode, onComplete, onLevelChange, onModeChange }) {
  const size = 5 + (level * 4);
  const generateRound = () => {
    const values = Array.from({ length: size }, (_, index) => (index + 2) * (7 + level));
    const targetIndex = Math.floor(Math.random() * values.length);
    return { values, target: values[targetIndex] };
  };

  const [round, setRound] = useState(generateRound);
  const [revealed, setRevealed] = useState([]);
  const [checks, setChecks] = useState(0);
  const [started, setStarted] = useState(false);
  const [saved, setSaved] = useState(false);
  const found = revealed.some((index) => round.values[index] === round.target);

  const initialTime = mode === 'time-attack' ? 45 - (level * 5) : 0;
  const [seconds, setSeconds] = useTimer(started && !found, initialTime, mode === 'time-attack');
  const failed = mode === 'time-attack' && seconds === 0 && !found;

  useEffect(() => {
    reset();
  }, [level, mode]);

  function reset() {
    setRound(generateRound());
    setRevealed([]);
    setChecks(0);
    setStarted(false);
    setSaved(false);
    setSeconds(initialTime);
  }

  function chooseBox(index) {
    if (found || failed || revealed.includes(index)) return;
    setStarted(true);
    setRevealed((current) => [...current, index]);
    setChecks((count) => count + 1);
  }

  useEffect(() => {
    if (!found || saved) return;
    const timeSeconds = mode === 'time-attack' ? initialTime - seconds : seconds;
    setSaved(true);
    onComplete('hidden', level, mode, timeSeconds, `${checks} checks`);
  }, [checks, found, initialTime, level, mode, onComplete, saved, seconds]);

  return (
    <article className={`play-panel ${failed ? 'failed' : ''}`}>
      <GameHeader 
        level={level} mode={mode} title="Find hidden number" icon={Search}
        onLevelChange={onLevelChange} onModeChange={onModeChange} 
      />
      <div className="metric-row">
        <span className={failed ? 'text-error' : ''}><Timer size={16} />{formatTime(seconds)}</span>
        <span><Target size={16} />{checks} checks</span>
      </div>
      <div className="target-chip">
        <span>Target</span>
        <strong>{round.target}</strong>
      </div>
      <div className="hidden-search-board">
        {round.values.map((value, index) => {
          const isRevealed = revealed.includes(index);
          const isFound = isRevealed && value === round.target;

          return (
            <button
              className={`hidden-box ${isRevealed ? 'revealed' : ''} ${isFound ? 'found' : ''}`}
              key={`${value}-${index}`}
              onClick={() => chooseBox(index)}
            >
              <span>Index {index}</span>
              <strong>{isRevealed ? value : '?'}</strong>
            </button>
          );
        })}
      </div>
      <p className="game-status">{failed ? 'Time out!' : found ? `Found ${round.target} in ${checks} checks.` : 'Choose an index.'}</p>
      <button className="wide-button" onClick={reset}><RefreshCw size={16} />New boxes</button>
    </article>
  );
}

export function Games() {
  const { auth } = useAuth();
  const [games, setGames] = useState([]);
  const [saveMessage, setSaveMessage] = useState(null);
  const [gameLevels, setGameLevels] = useState({
    sort: 1, guess: 1, hanoi: 1, build: 1, hidden: 1
  });
  const [gameModes, setGameModes] = useState({
    sort: 'standard', guess: 'standard', hanoi: 'standard', build: 'standard', hidden: 'standard'
  });

  useEffect(() => {
    api('/games')
      .then((data) => setGames(data.filter((game) => game.type === 'game')))
      .catch(() => setGames([]));
  }, []);

  const saveResult = useCallback(async (gameKey, level, mode, timeSeconds, answer) => {
    if (!auth) {
      setSaveMessage({ type: 'error', text: 'Log in to save scores.' });
      return;
    }

    const game = games.find((item) => {
      const title = item.title.replace(/\s+\(Time Attack\)$/i, '');
      return title === GAME_TITLES[gameKey] && item.level === level && item.mode === mode;
    });

    if (!game) {
      setSaveMessage({ type: 'error', text: 'Score could not be saved for this game.' });
      return;
    }

    try {
      await api('/scores', {
        method: 'POST',
        body: JSON.stringify({
          gameId: game._id,
          level,
          mode,
          score: game.points,
          timeSeconds,
          answer
        })
      });
      setSaveMessage({ type: 'success', text: `${GAME_TITLES[gameKey]} saved: ${game.points} pts, ${formatTime(timeSeconds)}.` });
    } catch {
      setSaveMessage({ type: 'error', text: 'Score save failed.' });
    }
  }, [auth, games]);

  return (
    <section className="page games-page">
      <div className="page-heading">
        <p className="eyebrow">Practice modes</p>
        <h1>Algorithm games</h1>
        <p>Sort under time pressure, search with hints, and solve recursive movement puzzles.</p>
      </div>
      {saveMessage && <div className={`save-status hint-box ${saveMessage.type}`}>{saveMessage.text}</div>}
      <div className="play-grid">
        <SortRace 
          level={gameLevels.sort} 
          mode={gameModes.sort} 
          onComplete={saveResult}
          onLevelChange={(l) => setGameLevels(prev => ({...prev, sort: l}))}
          onModeChange={(m) => setGameModes(prev => ({...prev, sort: m}))}
        />
        <GuessGame
          level={gameLevels.guess}
          mode={gameModes.guess}
          onComplete={saveResult}
          onLevelChange={(l) => setGameLevels(prev => ({...prev, guess: l}))}
          onModeChange={(m) => setGameModes(prev => ({...prev, guess: m}))}
        />
        <HanoiGame
          level={gameLevels.hanoi}
          mode={gameModes.hanoi}
          onComplete={saveResult}
          onLevelChange={(l) => setGameLevels(prev => ({...prev, hanoi: l}))}
          onModeChange={(m) => setGameModes(prev => ({...prev, hanoi: m}))}
        />
        <BuildSortedGame
          level={gameLevels.build}
          mode={gameModes.build}
          onComplete={saveResult}
          onLevelChange={(l) => setGameLevels(prev => ({...prev, build: l}))}
          onModeChange={(m) => setGameModes(prev => ({...prev, build: m}))}
        />
        <HiddenIndexGame
          level={gameLevels.hidden}
          mode={gameModes.hidden}
          onComplete={saveResult}
          onLevelChange={(l) => setGameLevels(prev => ({...prev, hidden: l}))}
          onModeChange={(m) => setGameModes(prev => ({...prev, hidden: m}))}
        />
      </div>
    </section>
  );
}
