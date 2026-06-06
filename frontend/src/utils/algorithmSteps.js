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
    return order.map((node, index) => ({ active: [node], message: `Visit ${node}. Step ${index + 1}.` }));
  }

  if (algorithm.category === 'machine-learning') {
    return [
      { message: 'Convert every item into a vector.' },
      { message: 'Measure distance or similarity to the query.' },
      { message: 'Rank nearest vectors and return the best matches.' }
    ];
  }

  if (algorithm.category === 'sort') {
    return values.map((_, index) => ({
      active: [index, Math.min(index + 1, values.length - 1)],
      message: `Compare and place values around index ${index}.`
    }));
  }

  if (algorithm.slug === 'binary-search') {
    return binarySearchSteps(values, target);
  }

  return values.map((value, index) => ({
    active: [index],
    found: value === target ? index : undefined,
    message: value === target ? `Found ${target} at index ${index}.` : `Check ${value}; continue searching.`
  }));
}

function binarySearchSteps(values, target) {
  const sorted = [...values].sort((a, b) => a - b);
  let left = 0;
  let right = sorted.length - 1;
  const steps = [];

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    steps.push({
      active: [mid],
      found: sorted[mid] === target ? mid : undefined,
      message: `Check middle value ${sorted[mid]}.`
    });
    if (sorted[mid] === target) break;
    if (sorted[mid] < target) left = mid + 1;
    else right = mid - 1;
  }

  return steps.length ? steps : [{ message: 'No data to search.' }];
}

function bfsOrder() {
  const queue = ['A'];
  const visited = new Set(['A']);
  const order = [];

  while (queue.length) {
    const node = queue.shift();
    order.push(node);
    graph[node].forEach((next) => {
      if (!visited.has(next)) {
        visited.add(next);
        queue.push(next);
      }
    });
  }

  return order;
}

function dfsOrder(node = 'A', visited = new Set(), order = []) {
  visited.add(node);
  order.push(node);
  graph[node].forEach((next) => {
    if (!visited.has(next)) dfsOrder(next, visited, order);
  });
  return order;
}
