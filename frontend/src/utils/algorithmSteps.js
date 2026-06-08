const graph = {
  A: ['B', 'C'],
  B: ['D', 'E'],
  C: ['F'],
  D: [],
  E: ['G'],
  F: [],
  G: []
};

export const initialValues = [14, 7, 29, 3, 18, 41, 10, 24];

export function parseValues(input) {
  return input
    .split(',')
    .map((value) => Number(value.trim()))
    .filter((value) => Number.isFinite(value));
}

export function shuffle(values) {
  return [...values].sort(() => Math.random() - 0.5);
}

export function buildSteps(algorithm, values, target) {
  if (algorithm.category === 'graph') {
    const order = algorithm.slug === 'bfs' ? bfsOrder() : dfsOrder();
    return withRoundCounts(order.map(({ node, from }, index) => {
      const visited = order.slice(0, index + 1).map((item) => item.node);
      return {
        active: [node],
        edge: from ? [from, node] : undefined,
        visited,
        message: `${algorithm.slug === 'bfs' ? 'Queue' : 'Stack'} visits ${node}. Step ${index + 1}.`
      };
    }));
  }

  if (algorithm.category === 'machine-learning') {
    if (algorithm.slug === 'knn') return withRoundCounts(knnSteps(values, target));

    return withRoundCounts([
      { message: 'Convert every item into a vector.' },
      { message: 'Measure distance or similarity to the query.' },
      { message: 'Rank nearest vectors and return the best matches.' }
    ]);
  }

  if (algorithm.category === 'sort') {
    return withRoundCounts(values.map((_, index) => ({
      active: [index, Math.min(index + 1, values.length - 1)],
      message: `Compare and place values around index ${index}.`
    })));
  }

  if (algorithm.category === 'search') {
    if (algorithm.slug === 'binary-search') return withRoundCounts(binarySearchSteps(values, target));
    if (algorithm.slug === 'jump-search') return withRoundCounts(jumpSearchSteps(values, target));
    if (algorithm.slug === 'interpolation-search') return withRoundCounts(interpolationSearchSteps(values, target));
    return withRoundCounts(linearSearchSteps(values, target));
  }

  return withRoundCounts([{ message: 'No animation available for this algorithm.' }]);
}

function withRoundCounts(steps) {
  const totalRounds = steps.length;
  return steps.map((step, index) => ({
    ...step,
    round: index + 1,
    totalRounds
  }));
}

function linearSearchSteps(values, target) {
  const steps = [];
  let foundTarget = false;

  for (let index = 0; index < values.length; index++) {
    const found = values[index] === target;
    if (found) foundTarget = true;
    steps.push({
      active: [index],
      found: found ? index : undefined,
      codeLines: found ? [3] : [2, 3],
      message: found ? `Found ${target} at index ${index}.` : `Check ${values[index]}; continue searching.`,
      detail: found
        ? `This box has the number we want, so we can stop searching.`
        : `Look at one box at a time from left to right. This box is ${values[index]}, not ${target}, so we move to the next box.`
    });
    if (found) break;
  }

  if (steps.length && !foundTarget) {
    steps.push({
      active: [],
      codeLines: [5],
      phase: 'Not found',
      message: `${target} was not found.`,
      detail: `We checked every box and none of them contained ${target}, so the search returns -1.`
    });
  }

  return steps.length ? steps : [{ message: 'No data to search.' }];
}

function binarySearchSteps(values, target) {
  const sorted = [...values].sort((a, b) => a - b);
  let left = 0;
  let right = sorted.length - 1;
  const steps = [];
  let foundTarget = false;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const found = sorted[mid] === target;
    if (found) foundTarget = true;
    steps.push({
      active: [mid],
      found: found ? mid : undefined,
      low: left,
      high: right,
      codeLines: found ? [5, 6] : sorted[mid] < target ? [5, 7] : [5, 8],
      message: found ? `Found ${target} at middle index ${mid}.` : `Check middle value ${sorted[mid]}.`,
      detail: found
        ? `The middle box has the number we want, so we can stop searching.`
        : `Look at the middle box first. If it is too small, keep only the right side. If it is too big, keep only the left side.`
    });
    if (found) break;
    if (sorted[mid] < target) left = mid + 1;
    else right = mid - 1;
  }

  if (steps.length && !foundTarget) {
    steps.push({
      active: [],
      low: left,
      high: right,
      codeLines: [10],
      phase: 'Not found',
      message: `${target} was not found.`,
      detail: `The search range is empty now, so ${target} is not in the sorted data and the search returns -1.`
    });
  }

  return steps.length ? steps : [{ message: 'No data to search.' }];
}

function jumpSearchSteps(values, target) {
  const sorted = [...values].sort((a, b) => a - b);
  const steps = [];
  const blockSize = Math.max(1, Math.floor(Math.sqrt(sorted.length)));
  let start = 0;
  let end = blockSize;
  let jumpStep = 1;
  let findStep = 1;
  let foundTarget = false;

  steps.push({
    active: [],
    low: 0,
    high: sorted.length - 1,
    phase: 'Prepare',
    codeLines: [2],
    message: `Prepare: jump size is ${blockSize}.`,
    detail: `First we find the jump step by taking the square root of the data size and rounding down. The data has ${sorted.length} numbers, square root is ${Math.sqrt(sorted.length).toFixed(2)}, so we round down and get ${blockSize}.`
  });

  while (start < sorted.length && sorted[Math.min(end, sorted.length) - 1] < target) {
    const compareIndex = Math.min(end, sorted.length) - 1;
    steps.push({
      active: [compareIndex],
      low: start,
      high: Math.min(end, sorted.length) - 1,
      phase: `Jump step ${jumpStep}`,
      codeLines: [6, 7, 8],
      message: `Jump step ${jumpStep}: jump forward ${blockSize} boxes.`,
      detail: `Now we jump ${blockSize} boxes and check the box we land near. It has ${sorted[compareIndex]}. That is still smaller than ${target}, so we jump again.`
    });
    jumpStep++;
    start = end;
    end += blockSize;
  }

  if (start >= sorted.length) {
    steps.push({
      active: [],
      codeLines: [9],
      phase: 'Not found',
      message: `${target} was not found.`,
      detail: `${target} is outside the searched blocks, so the search returns -1.`
    });
    return steps;
  }

  const scanEnd = Math.min(end, sorted.length);
  steps.push({
    active: range(start, scanEnd),
    low: start,
    high: scanEnd - 1,
    phase: 'Find block',
    codeLines: [12],
    message: `Find block: search inside this small group.`,
    detail: `Now we stop jumping. The number we want can only be inside this highlighted group, so we check this group one box at a time.`
  });

  for (let index = start; index < scanEnd; index++) {
    const found = sorted[index] === target;
    if (found) foundTarget = true;
    steps.push({
      active: [index],
      found: found ? index : undefined,
      low: start,
      high: scanEnd - 1,
      phase: `Find step ${findStep}`,
      codeLines: found ? [13] : [12, 13],
      message: found ? `Find step ${findStep}: found ${target}.` : `Find step ${findStep}: check ${sorted[index]}.`,
      detail: found
        ? `This box is ${target}. That is the number we want, so we stop.`
        : `This box is ${sorted[index]}, not ${target}. Stay inside this small group and check the next box.`
    });
    findStep++;
    if (found) break;
    if (sorted[index] > target) {
      steps.push({
        low: start,
        high: scanEnd - 1,
        phase: `Find step ${findStep}`,
        codeLines: [12],
        message: `Find step ${findStep}: ${target} is not in this group.`,
        detail: `This box is already bigger than ${target}. Because the numbers are sorted, the number we want cannot be after this box.`
      });
      break;
    }
  }

  if (steps.length && !foundTarget) {
    steps.push({
      active: [],
      low: start,
      high: scanEnd - 1,
      codeLines: [15],
      phase: 'Not found',
      message: `${target} was not found.`,
      detail: `We checked the possible block and did not find ${target}, so the search returns -1.`
    });
  }

  return steps.length ? steps : [{ message: 'No data to search.' }];
}

function interpolationSearchSteps(values, target) {
  const sorted = [...values].sort((a, b) => a - b);
  const steps = [];
  let low = 0;
  let high = sorted.length - 1;
  let foundTarget = false;

  while (low <= high && target >= sorted[low] && target <= sorted[high]) {
    if (sorted[low] === sorted[high]) {
      const found = sorted[low] === target;
      if (found) foundTarget = true;
      steps.push({
        active: [low],
        found: found ? low : undefined,
        low,
        high,
        codeLines: [5, 6],
        message: found ? `Found ${target} at index ${low}.` : `All remaining values are ${sorted[low]}, so ${target} is not present.`,
        detail: found
          ? `This box has the number we want, so we can stop searching.`
          : `The remaining boxes all have the same number, and it is not ${target}.`
      });
      break;
    }

    const estimate = low + Math.floor(((target - sorted[low]) * (high - low)) / (sorted[high] - sorted[low]));
    const pos = Math.max(low, Math.min(high, estimate));
    const found = sorted[pos] === target;
    if (found) foundTarget = true;
    const direction = sorted[pos] < target ? 'right' : 'left';
    const rangeText = `The current search area is from index ${low} with value ${sorted[low]} to index ${high} with value ${sorted[high]}.`;
    const guessText = `To guess the box, we calculate how far ${target} is between the low value and high value: target minus low value, times the remaining index size (${high} - ${low}), divided by the difference between the high value and low value (${sorted[high]} - ${sorted[low]}).`;
    steps.push({
      active: [pos],
      found: found ? pos : undefined,
      low,
      high,
      phase: `Guess box ${pos}`,
      codeLines: found ? [7, 8] : sorted[pos] < target ? [7, 9] : [7, 10],
      message: found
        ? `Guess box ${pos}: found ${target}.`
        : `Guess box ${pos}: ${sorted[pos]} is ${sorted[pos] < target ? 'less' : 'greater'} than ${target}.`,
      detail: found
        ? `${rangeText} ${guessText} That gives guess box ${pos}. That box has ${target}, so we stop.`
        : `${rangeText} ${guessText} That gives guess box ${pos}. The box has ${sorted[pos]}, so ${target} must be farther to the ${direction}.`
    });
    if (found) break;
    if (sorted[pos] < target) low = pos + 1;
    else high = pos - 1;
  }

  if (!steps.length || !foundTarget) {
    steps.push({
      codeLines: [5, 12],
      phase: 'Not found',
      message: `${target} was not found.`,
      detail: steps.length
        ? `The estimated search range is empty now, so ${target} is not in the sorted data and the search returns -1.`
        : `${target} is smaller than the first number or bigger than the last number, so it cannot be in this sorted data.`
    });
  }

  return steps;
}

function range(start, end) {
  return Array.from({ length: Math.max(0, end - start) }, (_, offset) => start + offset);
}

function knnSteps(input, target) {
  const items = parseKnnItems(input);
  const rawItems = items.map((item) => item.raw);
  const query = buildKnnPoint(String(target || items[0]?.raw || 'target'), 'Target', rawItems, true);
  const distances = items
    .map((item) => ({
      ...item,
      distance: Math.hypot(item.x - query.x, item.y - query.y)
    }))
    .sort((a, b) => a.distance - b.distance);
  const nearest = distances.slice(0, Math.min(3, distances.length));
  const prediction = chooseKnnLabel(nearest);
  const base = { points: items, query, nearest: [] };

  if (!items.length) {
    return [{ message: 'Add numbers or words first so KNN can map them.' }];
  }

  return [
    {
      ...base,
      phase: 'Map data',
      codeLines: [2, 3],
      message: 'Map each number or word into a point.',
      detail: 'KNN first turns each input into features. Numbers use their value. Words use length and first letter so they can be placed on the map.'
    },
    ...distances.map((item, index) => ({
      ...base,
      activePoint: item.id,
      measured: distances.slice(0, index + 1).map((entry) => entry.id),
      phase: `Distance ${index + 1}`,
      codeLines: [5, 6],
      message: `Measure distance from target to ${item.raw}.`,
      detail: `${item.raw} is ${item.distance.toFixed(1)} map units from the target. Smaller distance means more similar.`
    })),
    {
      ...base,
      measured: distances.map((item) => item.id),
      nearest: nearest.map((item) => item.id),
      phase: 'Pick nearest',
      codeLines: [8],
      message: 'Choose the 3 closest points.',
      detail: `The nearest neighbors are ${nearest.map((item) => item.raw).join(', ')}. KNN only votes with these closest examples.`
    },
    {
      ...base,
      measured: distances.map((item) => item.id),
      nearest: nearest.map((item) => item.id),
      prediction,
      phase: 'Vote',
      codeLines: [9, 10],
      message: `Predicted class: ${prediction}.`,
      detail: `The closest examples vote by label, so the target is predicted as "${prediction}".`
    }
  ];
}

function parseKnnItems(input) {
  const rawItems = Array.isArray(input)
    ? input.map((item) => String(item))
    : String(input || '').split(',').map((item) => item.trim()).filter(Boolean);
  const numericValues = rawItems.map(Number).filter((value) => Number.isFinite(value));
  const numericMedian = numericValues.length
    ? [...numericValues].sort((a, b) => a - b)[Math.floor(numericValues.length / 2)]
    : 0;

  return rawItems.map((raw, index, all) => buildKnnPoint(raw, getKnnLabel(raw, numericMedian), all, false, index));
}

function buildKnnPoint(raw, label, allItems, isQuery = false, index = 0) {
  const number = Number(raw);
  const allNumbers = allItems.map(Number).filter((value) => Number.isFinite(value));

  if (Number.isFinite(number) && allNumbers.length) {
    const min = Math.min(...allNumbers, number);
    const max = Math.max(...allNumbers, number);
    const spread = max - min || 1;
    const normalized = (number - min) / spread;
    return {
      id: isQuery ? 'target' : `p-${index}`,
      raw,
      label,
      x: 12 + normalized * 76,
      y: 78 - normalized * 52 + (isQuery ? 0 : (index % 3) * 8),
      feature: `value ${number}`
    };
  }

  const word = raw.toLowerCase();
  const maxLength = Math.max(...allItems.map((item) => String(item).length), raw.length, 1);
  const firstCode = word.charCodeAt(0) || 97;
  return {
    id: isQuery ? 'target' : `p-${index}`,
    raw,
    label,
    x: 12 + (raw.length / maxLength) * 76,
    y: 82 - ((firstCode - 97) / 25) * 58,
    feature: `length ${raw.length}`
  };
}

function getKnnLabel(raw, numericMedian) {
  const number = Number(raw);
  if (Number.isFinite(number)) return number >= numericMedian ? 'high' : 'low';
  return raw.length >= 6 ? 'long text' : 'short text';
}

function chooseKnnLabel(nearest) {
  const counts = nearest.reduce((acc, item) => {
    acc[item.label] = (acc[item.label] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'unknown';
}

function bfsOrder() {
  const queue = [{ node: 'A', from: null }];
  const visited = new Set(['A']);
  const order = [];

  while (queue.length) {
    const current = queue.shift();
    order.push(current);
    const { node } = current;
    graph[node].forEach((next) => {
      if (!visited.has(next)) {
        visited.add(next);
        queue.push({ node: next, from: node });
      }
    });
  }

  return order;
}

function dfsOrder(node = 'A', visited = new Set(), order = [], from = null) {
  visited.add(node);
  order.push({ node, from });
  graph[node].forEach((next) => {
    if (!visited.has(next)) dfsOrder(next, visited, order, node);
  });
  return order;
}
