const graph = {
  A: ['B', 'C'],
  B: ['D', 'E'],
  C: ['F'],
  D: [],
  E: ['G'],
  F: [],
  G: []
};

export function parseValues(input) {
  return input
    .split(',')
    .map((value) => Number(value.trim()))
    .filter((value) => Number.isFinite(value));
}

export function shuffle(values) {
  return [...values].sort(() => Math.random() - 0.5);
}

export function buildSteps(algorithm, values, target, options = {}) {
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
    if (algorithm.slug === 'knn') return withRoundCounts(knnSteps(values, target, options));
    if (isNearestNeighborSearch(algorithm.slug)) return withRoundCounts(nearestNeighborSteps(algorithm.slug, values, target, options));
    if (algorithm.slug === 'vector-search') return withRoundCounts(vectorSearchSteps(values, target, algorithm.vectorSearchMode, options));

    return withRoundCounts([
      { message: 'Convert every item into a vector.' },
      { message: 'Measure distance or similarity to the query.' },
      { message: 'Rank nearest vectors and return the best matches.' }
    ]);
  }

  if (algorithm.category === 'sort') {
    if (algorithm.slug === 'bucket-sort') return withRoundCounts(bucketSortSteps(values));
    if (algorithm.slug === 'bubble-sort') return withRoundCounts(bubbleSortSteps(values));
    if (algorithm.slug === 'selection-sort') return withRoundCounts(selectionSortSteps(values));
    if (algorithm.slug === 'merge-sort') return withRoundCounts(mergeSortSteps(values));
    if (algorithm.slug === 'quick-sort') return withRoundCounts(quickSortSteps(values));
    if (algorithm.slug === 'heap-sort') return withRoundCounts(heapSortSteps(values));
    return withRoundCounts(movingSortSteps(values, algorithm.name));
  }

  if (algorithm.category === 'search') {
    if (algorithm.slug === 'binary-search') return withRoundCounts(binarySearchSteps(values, target));
    if (algorithm.slug === 'jump-search') return withRoundCounts(jumpSearchSteps(values, target));
    if (algorithm.slug === 'interpolation-search') return withRoundCounts(interpolationSearchSteps(values, target));
    return withRoundCounts(linearSearchSteps(values, target));
  }

  return withRoundCounts([{ message: 'No animation available for this algorithm.' }]);
}

export function buildKnnPreview(input, target) {
  const items = parseKnnItems(input);
  const query = buildKnnPoint(String(target || items[0]?.raw || 'target'), 'target', true);

  return {
    points: items,
    query,
    compareTo: items.map((item) => item.id),
    phase: 'Target comparison',
    detail: 'Enter a new thing like bird, fox, or drone. The demo first converts it into features, then KNN compares those numbers with labeled examples.'
  };
}

export function buildVectorPreview(input, target, mode = 'top-k') {
  const items = parseVectorItems(input);
  const query = buildVectorPoint(String(target || items[0]?.raw || 'query'), true);
  const modeConfig = nearestNeighborModeConfig(mode);

  return {
    points: items,
    query,
    compareTo: modeConfig.compareCandidates ? modeConfig.compareCandidates(items, query).map((item) => item.id) : items.map((item) => item.id),
    searchMode: modeConfig.id,
    radius: modeConfig.radius,
    phase: modeConfig.previewPhase,
    detail: modeConfig.previewDetail,
    modeLabel: modeConfig.modeLabel
  };
}

function nearestNeighborModeConfig(mode) {
  if (mode === 'ann') {
    return {
      id: 'ann',
      radius: null,
      modeLabel: 'ANN',
      previewPhase: 'Approximate nearest neighbor',
      previewDetail: 'ANN narrows to likely candidates first, then ranks only those vectors.',
      compareCandidates: (items, query) => previewCandidateVectorItems(items, query)
    };
  }

  if (mode === 'hnsw') {
    return {
      id: 'hnsw',
      radius: null,
      modeLabel: 'HNSW',
      previewPhase: 'Layered graph walk',
      previewDetail: 'HNSW jumps through graph layers, then refines the answer in the lower layers.',
      compareCandidates: (items, query) => previewCandidateVectorItems(items, query)
    };
  }

  if (mode === 'kd-tree') {
    return {
      id: 'kd-tree',
      radius: null,
      modeLabel: 'K-d Tree',
      previewPhase: 'Axis split search',
      previewDetail: 'A k-d tree splits by axes and checks the most promising side first.',
      compareCandidates: (items) => items
    };
  }

  if (mode === 'brute-force-search') {
    return {
      id: 'brute-force-search',
      radius: null,
      modeLabel: 'Brute force',
      previewPhase: 'Full scan',
      previewDetail: 'Brute force compares the query to every stored vector.',
      compareCandidates: (items) => items
    };
  }

  return {
    id: 'top-k',
    radius: null,
    modeLabel: 'Top K',
    previewPhase: 'Top-k search',
    previewDetail: 'Top-k search ranks every vector and returns a fixed number of closest matches.',
    compareCandidates: (items) => items
  };
}

function previewCandidateVectorItems(items, query) {
  const candidates = items.filter((item) => (
    item.label === query.label ||
    cosineSimilarity(item.vector, query.vector) > 0.25
  ));

  return (candidates.length ? candidates : items)
    .slice()
    .sort((a, b) => cosineSimilarity(b.vector, query.vector) - cosineSimilarity(a.vector, query.vector))
    .slice(0, Math.min(8, items.length));
}

function isNearestNeighborSearch(slug) {
  return ['ann', 'hnsw', 'kd-tree', 'brute-force-search'].includes(slug);
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

function bubbleSortSteps(values) {
  const array = values.map((value, index) => ({ id: `item-${index}`, value }));
  const steps = [{
    items: snapshotSortItems(array),
    active: [],
    sorted: [],
    phase: 'Start',
    codeLines: [2],
    message: 'Start with the unsorted boxes.',
    detail: 'Bubble sort compares two neighboring boxes. If the left box is bigger, the two boxes swap places.'
  }];

  for (let pass = 0; pass < array.length - 1; pass++) {
    for (let index = 0; index < array.length - pass - 1; index++) {
      const shouldSwap = array[index].value > array[index + 1].value;
      steps.push({
        items: snapshotSortItems(array),
        active: [index, index + 1],
        sorted: range(array.length - pass, array.length),
        phase: `Compare ${index} and ${index + 1}`,
        codeLines: [4, 5],
        message: shouldSwap ? `Swap ${array[index].value} and ${array[index + 1].value}.` : `Keep ${array[index].value} and ${array[index + 1].value}.`,
        detail: shouldSwap
          ? `${array[index].value} is bigger than ${array[index + 1].value}, so the boxes move and trade places.`
          : `${array[index].value} is already before ${array[index + 1].value}, so the boxes stay where they are.`
      });

      if (shouldSwap) {
        [array[index], array[index + 1]] = [array[index + 1], array[index]];
        steps.push({
          items: snapshotSortItems(array),
          active: [index, index + 1],
          swapped: [index, index + 1],
          swap: { left: index, right: index + 1 },
          sorted: range(array.length - pass, array.length),
          phase: 'Move boxes',
          codeLines: [6],
          message: 'The two boxes have moved.',
          detail: `Now ${array[index].value} is on the left and ${array[index + 1].value} is on the right.`
        });
      }
    }
  }

  steps.push({
    items: snapshotSortItems(array),
    active: [],
    sorted: range(0, array.length),
    phase: 'Sorted',
    message: 'All boxes are in order.',
    detail: 'Every pass moved larger values to the right until the full row became sorted.'
  });

  return steps;
}

function selectionSortSteps(values) {
  const array = values.map((value, index) => ({ id: `item-${index}`, value }));
  const steps = [{
    items: snapshotSortItems(array),
    active: [],
    sorted: [],
    phase: 'Start',
    codeLines: [2],
    message: 'Start with the unsorted boxes.',
    detail: 'Selection sort finds the smallest remaining box and moves it into the next sorted position.'
  }];

  for (let position = 0; position < array.length; position++) {
    let minIndex = position;
    steps.push({
      items: snapshotSortItems(array),
      active: [position],
      sorted: range(0, position),
      marker: minIndex,
      phase: `Position ${position}`,
      codeLines: [3, 4],
      message: `Find the smallest box for position ${position}.`,
      detail: `The sorted area ends before position ${position}. Search the remaining boxes for the smallest value.`
    });

    for (let scan = position + 1; scan < array.length; scan++) {
      const foundNewMin = array[scan].value < array[minIndex].value;
      steps.push({
        items: snapshotSortItems(array),
        active: [minIndex, scan],
        sorted: range(0, position),
        marker: foundNewMin ? scan : minIndex,
        phase: `Scan ${scan}`,
        codeLines: [5, 6],
        message: foundNewMin ? `${array[scan].value} becomes the new smallest.` : `${array[minIndex].value} is still the smallest.`,
        detail: foundNewMin
          ? `${array[scan].value} is smaller than ${array[minIndex].value}, so remember this box as the smallest.`
          : `${array[scan].value} is not smaller than ${array[minIndex].value}, so keep the current smallest box.`
      });
      if (foundNewMin) minIndex = scan;
    }

    if (minIndex !== position) {
      [array[position], array[minIndex]] = [array[minIndex], array[position]];
      steps.push({
        items: snapshotSortItems(array),
        active: [position, minIndex],
        swapped: [position, minIndex],
        swap: { left: position, right: minIndex },
        sorted: range(0, position + 1),
        phase: 'Move smallest',
        codeLines: [8],
        message: `Move ${array[position].value} into sorted position ${position}.`,
        detail: `The smallest remaining box moves into position ${position}.`
      });
    } else {
      steps.push({
        items: snapshotSortItems(array),
        active: [position],
        sorted: range(0, position + 1),
        phase: 'Already placed',
        codeLines: [8],
        message: `${array[position].value} is already in the right place.`,
        detail: `No swap is needed because the smallest remaining box is already at position ${position}.`
      });
    }
  }

  return steps;
}

function movingSortSteps(values, algorithmName) {
  const array = values.map((value, index) => ({ id: `item-${index}`, value }));
  const sortedTarget = [...values].sort((a, b) => a - b);
  const steps = [{
    items: snapshotSortItems(array),
    active: [],
    sorted: [],
    phase: 'Start',
    message: 'Start with the unsorted boxes.',
    detail: `${algorithmName} rearranges the boxes until the row is ordered from smallest to largest.`
  }];

  for (let position = 0; position < sortedTarget.length; position++) {
    const targetValue = sortedTarget[position];
    const currentIndex = array.findIndex((item, index) => index >= position && item.value === targetValue);
    steps.push({
      items: snapshotSortItems(array),
      active: [position, currentIndex],
      sorted: range(0, position),
      phase: `Place ${targetValue}`,
      message: `Move ${targetValue} into position ${position}.`,
      detail: `Find the next smallest box, then move it into the next open sorted position.`
    });

    if (currentIndex !== position) {
      [array[position], array[currentIndex]] = [array[currentIndex], array[position]];
      steps.push({
        items: snapshotSortItems(array),
        active: [position, currentIndex],
        swapped: [position, currentIndex],
        swap: { left: position, right: currentIndex },
        sorted: range(0, position + 1),
        phase: 'Move box',
        message: `${targetValue} moved into place.`,
        detail: `The box changed position, so the sorted area grows by one box.`
      });
    }
  }

  steps.push({
    items: snapshotSortItems(array),
    active: [],
    sorted: range(0, array.length),
    phase: 'Sorted',
    message: 'All boxes are in order.',
    detail: 'The row now matches the sorted order.'
  });

  return steps;
}

function quickSortSteps(values) {
  const array = values.map((value, index) => ({ id: `item-${index}`, value }));
  const sorted = new Set();
  const steps = [{
    items: snapshotSortItems(array),
    active: [],
    sorted: [],
    phase: 'Start',
    codeLines: [1],
    message: 'Start with the full row.',
    detail: 'Quicksort chooses a pivot, covers that section, then divides smaller values to the left and larger values to the right.'
  }];

  function addStep(step) {
    steps.push({
      items: snapshotSortItems(array),
      sorted: [...sorted],
      ...step
    });
  }

  function sortRange(low, high) {
    if (low > high) return;

    if (low === high) {
      sorted.add(low);
      addStep({
        active: [low],
        partition: { start: low, end: high, pivotIndex: low, pivotValue: array[low].value },
        marker: low,
        phase: `Single box ${low}`,
        codeLines: [2],
        message: `${array[low].value} is already sorted.`,
        detail: 'A section with one box does not need more dividing.'
      });
      return;
    }

    const pivotIndex = high;
    const pivotValue = array[pivotIndex].value;
    let storeIndex = low;

    addStep({
      active: range(low, high + 1),
      partition: { start: low, end: high, pivotIndex, pivotValue },
      marker: pivotIndex,
      phase: `Pivot ${pivotValue}`,
      codeLines: [3, 4],
      message: `Use ${pivotValue} as the pivot.`,
      detail: `The covered section is indexes ${low} to ${high}. The pivot is ${pivotValue}, so smaller boxes move before it and larger boxes stay after it.`
    });

    for (let scan = low; scan < high; scan++) {
      const movesLeft = array[scan].value < pivotValue;
      addStep({
        active: [scan, pivotIndex],
        partition: { start: low, end: high, pivotIndex, pivotValue },
        marker: pivotIndex,
        phase: `Compare ${array[scan].value}`,
        codeLines: movesLeft ? [5, 6] : [5],
        message: movesLeft ? `${array[scan].value} goes left of pivot ${pivotValue}.` : `${array[scan].value} stays right of pivot ${pivotValue}.`,
        detail: movesLeft
          ? `${array[scan].value} is smaller than the pivot ${pivotValue}, so it belongs in the left part of this covered section.`
          : `${array[scan].value} is not smaller than the pivot ${pivotValue}, so it remains in the right part for now.`
      });

      if (movesLeft) {
        if (scan !== storeIndex) {
          [array[storeIndex], array[scan]] = [array[scan], array[storeIndex]];
          addStep({
            active: [storeIndex, scan],
            swapped: [storeIndex, scan],
            swap: { left: storeIndex, right: scan },
            partition: { start: low, end: high, pivotIndex: high, pivotValue },
            marker: high,
            phase: 'Move left',
            codeLines: [7, 8, 9, 10],
            message: `${array[storeIndex].value} moved into the left part.`,
            detail: `The left part grows because this value is smaller than pivot ${pivotValue}.`
          });
        }
        storeIndex++;
      }
    }

    if (storeIndex !== high) {
      [array[storeIndex], array[high]] = [array[high], array[storeIndex]];
      addStep({
        active: [storeIndex, high],
        swapped: [storeIndex, high],
        swap: { left: storeIndex, right: high },
        partition: { start: low, end: high, pivotIndex: storeIndex, pivotValue },
        marker: storeIndex,
        phase: 'Place pivot',
        codeLines: [13, 14, 15],
        message: `Put pivot ${pivotValue} between the two parts.`,
        detail: `Now every box left of ${pivotValue} is smaller, and every box right of it is greater or equal.`
      });
    }

    sorted.add(storeIndex);
    addStep({
      active: [storeIndex],
      partition: { start: low, end: high, pivotIndex: storeIndex, pivotValue },
      marker: storeIndex,
      phase: `Pivot fixed at ${storeIndex}`,
      codeLines: [17, 18],
      message: `Pivot ${pivotValue} is in its final position.`,
      detail: 'Quicksort now repeats the same pivot divide on the left and right sections.'
    });

    sortRange(low, storeIndex - 1);
    sortRange(storeIndex + 1, high);
  }

  sortRange(0, array.length - 1);

  steps.push({
    items: snapshotSortItems(array),
    active: [],
    sorted: range(0, array.length),
    phase: 'Sorted',
    message: 'All boxes are in order.',
    detail: 'Every pivot divided its covered section until the full row became sorted.'
  });

  return steps;
}

function heapSortSteps(values) {
  const heap = values.map((value, index) => ({ id: `item-${index}`, value }));
  const steps = [{
    heapItems: snapshotSortItems(heap),
    heapSize: heap.length,
    active: [],
    sorted: [],
    phase: 'Start',
    codeLines: [1],
    message: 'Start with the array as a binary tree.',
    detail: 'Heap sort first views the array as a tree. Each parent uses array index rules: left child is 2i + 1, right child is 2i + 2.'
  }];

  if (!heap.length) {
    return [{ message: 'No data to sort.' }];
  }

  function addHeapStep(step) {
    steps.push({
      heapItems: snapshotSortItems(heap),
      heapSize: heap.length,
      sorted: range(step.heapSize ?? heap.length, heap.length),
      ...step
    });
  }

  function siftDown(rootIndex, heapSize, context) {
    let root = rootIndex;

    while (true) {
      const left = 2 * root + 1;
      const right = 2 * root + 2;
      let largest = root;
      const children = [left, right].filter((index) => index < heapSize);

      if (!children.length) {
        addHeapStep({
          heapSize,
          active: [root],
          phase: `${context}: leaf`,
          codeLines: [4, 5, 6],
          message: `${heap[root].value} has no children inside the heap.`,
          detail: 'This node is already a leaf in the active heap, so it cannot move down any farther.'
        });
        return;
      }

      addHeapStep({
        heapSize,
        active: [root, ...children],
        phase: `${context}: compare`,
        codeLines: [4, 5, 6],
        message: `Compare parent ${heap[root].value} with its child node${children.length === 1 ? '' : 's'}.`,
        detail: `A max heap needs every parent to be greater than or equal to its children. Check ${heap[root].value}${children.map((index) => `, ${heap[index].value}`).join('')}.`
      });

      if (left < heapSize && heap[left].value > heap[largest].value) largest = left;
      if (right < heapSize && heap[right].value > heap[largest].value) largest = right;

      if (largest === root) {
        addHeapStep({
          heapSize,
          active: [root, ...children],
          phase: `${context}: valid`,
          codeLines: [7],
          message: `${heap[root].value} can stay above its children.`,
          detail: 'The parent is already the largest value in this small tree, so this part satisfies the max-heap rule.'
        });
        return;
      }

      [heap[root], heap[largest]] = [heap[largest], heap[root]];
      addHeapStep({
        heapSize,
        active: [root, largest],
        swapped: [root, largest],
        phase: `${context}: swap`,
        codeLines: [8, 9, 10],
        message: `Swap ${heap[largest].value} with larger child ${heap[root].value}.`,
        detail: `The larger child moves up so the biggest value in this small tree is closer to the root. Then we keep checking lower in the tree.`
      });

      root = largest;
    }
  }

  for (let index = Math.floor(heap.length / 2) - 1; index >= 0; index--) {
    addHeapStep({
      heapSize: heap.length,
      active: [index],
      phase: `Heapify node ${index}`,
      codeLines: [13],
      message: `Build max heap from node ${index}.`,
      detail: 'Start at the last parent and move backward. Each heapify makes one subtree obey the max-heap rule.'
    });
    siftDown(index, heap.length, 'Build heap');
  }

  addHeapStep({
    heapSize: heap.length,
    active: [0],
    phase: 'Max heap ready',
    codeLines: [13],
    message: `${heap[0].value} is now the largest value at the root.`,
    detail: 'The tree is a max heap, so the root holds the largest remaining number.'
  });

  for (let end = heap.length - 1; end > 0; end--) {
    [heap[0], heap[end]] = [heap[end], heap[0]];
    addHeapStep({
      heapSize: end,
      active: [0, end],
      swapped: [0, end],
      sorted: range(end, heap.length),
      phase: `Move max to index ${end}`,
      codeLines: [15, 16],
      message: `Move ${heap[end].value} into the sorted output.`,
      detail: `The root is the largest value in the heap, so it swaps with the last unsorted position. Index ${end} is now finished.`
    });

    siftDown(0, end, 'Restore heap');
  }

  steps.push({
    heapItems: snapshotSortItems(heap),
    heapSize: 0,
    active: [],
    sorted: range(0, heap.length),
    phase: 'Sorted',
    codeLines: [18],
    message: 'All tree nodes are sorted.',
    detail: 'Each round moved the largest remaining root into the output, so the final array is ordered from smallest to largest.'
  });

  return steps;
}

function bucketSortSteps(values) {
  const items = values.map((value, index) => ({ id: `item-${index}`, value }));
  if (!items.length) {
    return [{ message: 'No data to sort.' }];
  }

  const bucketCount = Math.min(5, Math.max(3, Math.ceil(Math.sqrt(items.length))));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const buckets = Array.from({ length: bucketCount }, () => []);
  const steps = [{
    buckets: snapshotBucketState(buckets),
    output: [],
    phase: 'Start',
    message: 'Start with the unsorted boxes.',
    detail: `Bucket sort spreads the numbers across ${bucketCount} buckets, sorts inside each bucket, then collects everything back into one sorted row.`
  }];

  items.forEach((item) => {
    const bucketIndex = getBucketIndex(item.value, min, max, bucketCount);
    buckets[bucketIndex].push(item);
    steps.push({
      buckets: snapshotBucketState(buckets),
      output: [],
      activeItem: item.id,
      activeBucket: bucketIndex,
      phase: `Put ${item.value}`,
      message: `Put ${item.value} into bucket ${bucketIndex + 1}.`,
      detail: `The value ${item.value} belongs in bucket ${bucketIndex + 1}, so it moves into that bucket first.`
    });
  });

  const sortedBuckets = buckets.map((bucket) => [...bucket].sort((a, b) => a.value - b.value));
  steps.push({
    buckets: snapshotBucketState(sortedBuckets),
    output: [],
    phase: 'Sort buckets',
    message: 'Sort each bucket inside itself.',
    detail: 'Numbers inside each bucket are sorted before the buckets are joined together.'
  });

  const output = [];
  sortedBuckets.forEach((bucket, bucketIndex) => {
    steps.push({
      buckets: snapshotBucketState(sortedBuckets),
      output: snapshotSortItems(output),
      activeBucket: bucketIndex,
      phase: `Collect bucket ${bucketIndex + 1}`,
      message: `Collect numbers from bucket ${bucketIndex + 1}.`,
      detail: `Take the sorted numbers from bucket ${bucketIndex + 1} and move them into the output row.`
    });

    bucket.forEach((item) => {
      output.push(item);
      steps.push({
        buckets: snapshotBucketState(sortedBuckets),
        output: snapshotSortItems(output),
        activeBucket: bucketIndex,
        activeItem: item.id,
        phase: `Move ${item.value}`,
        message: `Move ${item.value} to the output row.`,
        detail: `The smallest item in the current bucket moves to the final row next.`
      });
    });
  });

  steps.push({
    buckets: snapshotBucketState(sortedBuckets),
    output: snapshotSortItems(output),
    phase: 'Sorted',
    message: 'All numbers are back together in sorted order.',
    detail: 'The output row now shows the final sorted list.'
  });

  return steps;
}

function mergeSortSteps(values) {
  if (!values.length) {
    return [{ message: 'No data to sort.' }];
  }

  const splitRows = buildMergeSplitRows(values);
  const mergeRows = buildMergeRows(splitRows.at(-1));
  const rows = [
    ...splitRows.map((groups, index) => ({
      mode: 'split',
      label: index === 0 ? 'Start' : `Split row ${index}`,
      groups
    })),
    ...mergeRows.map((groups, index) => ({
      mode: 'merge',
      label: `Merge row ${index + 1}`,
      groups
    }))
  ];

  return rows.map((row, index) => {
    const revealedRows = rows.slice(0, index + 1);
    const isFirst = index === 0;
    const isFinal = index === rows.length - 1;
    const isSplit = row.mode === 'split';
    const groupText = row.groups.length === 1 ? '1 group' : `${row.groups.length} groups`;

    return {
      mergeRows: revealedRows,
      activeMergeRow: index,
      codeLines: isFirst ? [1] : isSplit ? [2, 3, 4, 5] : isFinal ? [11] : [8, 9],
      phase: isFirst ? 'Start' : isSplit ? row.label : isFinal ? 'Sorted' : row.label,
      message: isFirst
        ? 'Start with the full array.'
        : isSplit
          ? `Split into ${groupText}.`
          : isFinal
            ? 'The final merged row is sorted.'
            : `Merge into ${groupText}.`,
      detail: isFirst
        ? 'Merge sort starts by looking at the whole array as one box.'
        : isSplit
          ? 'Each box is split into left and right halves until every box contains one number.'
          : isFinal
            ? 'The last merge combines the sorted halves into one sorted array.'
            : 'Now neighboring boxes merge back together in sorted order, making larger sorted boxes each row.'
    };
  });
}

function buildMergeSplitRows(values) {
  const rows = [[values.map((value, index) => ({ id: `item-${index}`, value }))]];
  let current = rows[0];

  while (current.some((group) => group.length > 1)) {
    current = current.flatMap((group) => {
      if (group.length <= 1) return [group];
      const middle = Math.ceil(group.length / 2);
      return [group.slice(0, middle), group.slice(middle)];
    });
    rows.push(current);
  }

  return rows;
}

function buildMergeRows(singleItemGroups) {
  const rows = [];
  let current = singleItemGroups;

  while (current.length > 1) {
    current = current.reduce((next, group, index) => {
      if (index % 2 === 1) return next;
      const partner = current[index + 1];
      if (!partner) return [...next, group];
      return [...next, mergeSortedGroups(group, partner)];
    }, []);
    rows.push(current);
  }

  return rows;
}

function mergeSortedGroups(left, right) {
  const merged = [];
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex].value <= right[rightIndex].value) {
      merged.push(left[leftIndex]);
      leftIndex++;
    } else {
      merged.push(right[rightIndex]);
      rightIndex++;
    }
  }

  return merged.concat(left.slice(leftIndex), right.slice(rightIndex));
}

function snapshotSortItems(array) {
  return array.map((item) => ({ ...item }));
}

function snapshotBucketState(buckets) {
  return buckets.map((bucket) => snapshotSortItems(bucket));
}

function getBucketIndex(value, min, max, bucketCount) {
  if (max === min) return 0;
  const span = max - min + 1;
  const scaled = Math.floor(((value - min) / span) * bucketCount);
  return Math.max(0, Math.min(bucketCount - 1, scaled));
}

function range(start, end) {
  return Array.from({ length: Math.max(0, end - start) }, (_, offset) => start + offset);
}

function getNeighborCount(value, itemCount, fallback = 3) {
  const parsed = Number(value);
  const requested = Number.isInteger(parsed) ? parsed : fallback;
  return Math.max(1, Math.min(requested, Math.max(itemCount, 1)));
}

function knnSteps(input, target, options = {}) {
  const items = parseKnnItems(input);
  const query = buildKnnPoint(String(target || items[0]?.raw || 'target'), 'target', true);
  const distances = items
    .map((item) => ({
      ...item,
      distance: featureDistance(item.features, query.features),
      distanceParts: featureDistanceParts(item.features, query.features)
    }))
    .sort((a, b) => a.distance - b.distance);
  const k = getNeighborCount(options.k, distances.length);
  const nearest = distances.slice(0, k);
  const voteCounts = getKnnVoteCounts(nearest);
  const prediction = chooseKnnLabel(nearest);
  const distanceRows = distances.map((item, index) => ({
    id: item.id,
    raw: item.raw,
    label: item.label,
    rank: index + 1,
    distance: item.distance,
    parts: item.distanceParts,
    explanation: item.explanation
  }));
  const base = {
    points: items,
    query,
    nearest: [],
    k,
    distanceRows,
    voteCounts: [],
    featureLabels: ['size', 'nature', 'human-like']
  };

  if (!items.length) {
    return [{ message: 'Add numbers or words first so KNN can map them.' }];
  }

  return [
    {
      ...base,
      phase: 'Convert words to features',
      codeLines: [2, 3],
      message: 'Convert each known word into numeric features.',
      detail: `The target "${query.raw}" becomes ${formatFeatures(query.features)}. Every known example uses the same three features, so KNN can compare points on the same scale.`
    },
    ...distances.map((item, index) => ({
      ...base,
      activePoint: item.id,
      measured: distances.slice(0, index + 1).map((entry) => entry.id),
      activeDistance: {
        id: item.id,
        raw: item.raw,
        label: item.label,
        distance: item.distance,
        parts: item.distanceParts
      },
      phase: `Distance ${index + 1}`,
      codeLines: [5, 7],
      message: `Measure distance from ${query.raw} to ${item.raw}.`,
      detail: `${query.raw} ${formatFeatures(query.features)} vs ${item.raw} ${formatFeatures(item.features)}. Distance = sqrt(${item.distanceParts.map((part) => `${part.diff}^2`).join(' + ')}) = ${item.distance.toFixed(2)}. Smaller distance means more similar.`
    })),
    {
      ...base,
      measured: distances.map((item) => item.id),
      nearest: nearest.map((item) => item.id),
      voteCounts,
      phase: 'Pick nearest',
      codeLines: [10],
      message: `Choose the ${k} closest point${k === 1 ? '' : 's'}.`,
      detail: `After sorting by distance, keep only rank 1 through ${k}: ${nearest.map((item) => `${item.raw} (${item.distance.toFixed(2)})`).join(', ')}. Farther examples are ignored for this prediction.`
    },
    {
      ...base,
      measured: distances.map((item) => item.id),
      nearest: nearest.map((item) => item.id),
      voteCounts,
      prediction,
      phase: 'Vote',
      codeLines: [11],
      message: `Predicted category: ${prediction}.`,
      detail: `The kept neighbors vote by label: ${formatVoteCounts(voteCounts)}. The largest vote count wins, so "${query.raw}" is predicted as "${prediction}".`
    }
  ];
}

function vectorSearchSteps(input, target, mode = 'top-k', options = {}) {
  const items = parseVectorItems(input);
  const query = buildVectorPoint(String(target || items[0]?.raw || 'query'), true);
  const queryTokens = tokenizeText(query.raw);
  const modeConfig = vectorSearchModeConfig(mode);
  const comparedItems = modeConfig.id === 'ann' ? candidateVectorItems(items, query) : items;
  const ranked = items
    .map((item) => ({
      ...item,
      similarity: cosineSimilarity(item.vector, query.vector),
      matchReason: explainVectorMatch(item, query)
    }))
    .sort((a, b) => b.similarity - a.similarity);
  const comparedIds = new Set(comparedItems.map((item) => item.id));
  const comparedRanked = ranked.filter((item) => comparedIds.has(item.id));
  const positiveMatches = comparedRanked.filter((item) => item.similarity > 0);
  const k = getNeighborCount(options.k, positiveMatches.length);
  const topMatches = modeConfig.id === 'radius'
    ? comparedRanked.filter((item) => item.similarity >= modeConfig.radius)
    : positiveMatches.slice(0, k);
  const base = { points: items, query, nearest: [], searchMode: modeConfig.id, radius: modeConfig.radius, k };

  if (!items.length) {
    return [{ message: 'Add text items first so vector search can map them.' }];
  }

  return [
    {
      ...base,
      phase: 'Embed text',
      codeLines: [2, 3],
      message: 'Convert each stored word and the query sentence into vectors.',
      detail: `The word index stores single words. The query sentence splits into: ${queryTokens.join(', ')}. Each word and the full query are mapped into 8 dimensions: [self, people, emotion, animal, food, vehicle, place, learning]. ${modeConfig.embedDetail}`
    },
    ...comparedRanked.map((item, index) => ({
      ...base,
      activePoint: item.id,
      compareTo: comparedRanked.map((entry) => entry.id),
      measured: comparedRanked.slice(0, index + 1).map((entry) => entry.id),
      phase: `${modeConfig.compareLabel} ${index + 1}`,
      codeLines: [5, 7],
      message: `Compare query to ${item.raw}.`,
      detail: `"${item.raw}" matches by ${item.matchReason}. Cosine similarity is ${item.similarity.toFixed(2)}. The range is -1 opposite, 0 unrelated, and 1 same direction.`
    })),
    {
      ...base,
      compareTo: comparedRanked.map((entry) => entry.id),
      measured: comparedRanked.map((item) => item.id),
      nearest: topMatches.map((item) => item.id),
      prediction: topMatches.map((item) => item.raw).join(', '),
      phase: modeConfig.resultPhase,
      codeLines: [10],
      message: modeConfig.resultMessage,
      detail: topMatches.length
        ? modeConfig.resultDetail(topMatches)
        : modeConfig.emptyDetail
    }
  ];
}

function nearestNeighborSteps(mode, input, target, options = {}) {
  const items = parseVectorItems(input);
  const query = buildVectorPoint(String(target || items[0]?.raw || 'query'), true);
  const modeConfig = nearestNeighborModeConfig(mode);
  const comparedItems = modeConfig.compareCandidates(items, query);
  const ranked = comparedItems
    .map((item) => ({
      ...item,
      similarity: cosineSimilarity(item.vector, query.vector),
      matchReason: explainVectorMatch(item, query)
    }))
    .sort((a, b) => b.similarity - a.similarity);
  const k = getNeighborCount(options.k, ranked.length);
  const nearest = ranked.slice(0, k);
  const base = { points: items, query, nearest: [], searchMode: modeConfig.id, modeLabel: modeConfig.modeLabel, k };

  if (!items.length) {
    return [{ message: 'Add text items first so nearest-neighbor search can map them.' }];
  }

  return [
    {
      ...base,
      phase: 'Build index',
      codeLines: [2, 3],
      message: `Prepare ${modeConfig.modeLabel} data.`,
      detail: modeConfig.previewDetail
    },
    ...ranked.map((item, index) => ({
      ...base,
      activePoint: item.id,
      compareTo: ranked.map((entry) => entry.id),
      measured: ranked.slice(0, index + 1).map((entry) => entry.id),
      phase: `${modeConfig.modeLabel} compare ${index + 1}`,
      codeLines: [5, 7],
      message: `Compare query to ${item.raw}.`,
      detail: `"${item.raw}" matches by ${item.matchReason}. Cosine similarity is ${item.similarity.toFixed(2)}.`
    })),
    {
      ...base,
      compareTo: ranked.map((entry) => entry.id),
      measured: ranked.map((item) => item.id),
      nearest: nearest.map((item) => item.id),
      prediction: nearest.map((item) => item.raw).join(', '),
      phase: `${modeConfig.modeLabel} result`,
      codeLines: [10],
      message: `Return the nearest neighbors with ${modeConfig.modeLabel}.`,
      detail: `The closest matches are ${nearest.map((item) => `${item.raw} (${item.label})`).join(', ')}.`
    }
  ];
}

function vectorSearchModeConfig(mode) {
  if (mode === 'radius') {
    return {
      id: 'radius',
      radius: 0.45,
      previewPhase: 'Radius search',
      previewDetail: 'Radius search returns every vector inside a similarity threshold, so the result count can grow or shrink.',
      embedDetail: 'Radius mode will keep every item whose cosine similarity is at least 0.45.',
      compareLabel: 'Radius check',
      resultPhase: 'Filter by radius',
      resultMessage: 'Return all items inside the radius.',
      resultDetail: (matches) => `These items are inside the similarity radius: ${matches.map((item) => `${item.raw} (${item.similarity.toFixed(2)})`).join(', ')}.`,
      emptyDetail: 'No item reached the 0.45 similarity radius.'
    };
  }

  if (mode === 'ann') {
    return {
      id: 'ann',
      radius: null,
      previewPhase: 'Approximate search',
      previewDetail: 'Approximate search compares only likely candidate vectors first, trading perfect recall for speed.',
      embedDetail: 'Approximate mode first narrows the search to candidate vectors with a related dominant dimension.',
      compareLabel: 'Candidate',
      resultPhase: 'Rank candidates',
      resultMessage: 'Return the best candidate matches.',
      resultDetail: (matches) => `The approximate candidate scan returns ${matches.map((item) => `${item.raw} (${item.label})`).join(', ')}. It is faster because it skipped unrelated clusters.`,
      emptyDetail: 'The approximate candidate set did not contain a positive match.'
    };
  }

  return {
    id: 'top-k',
    radius: null,
    previewPhase: 'Top-k search',
    previewDetail: 'Top-k search ranks every vector and returns a fixed number of closest matches.',
    embedDetail: 'Top-k mode will compare every stored vector and keep the requested number of highest scores.',
    compareLabel: 'Similarity',
    resultPhase: 'Rank top K',
    resultMessage: 'Return the most similar items.',
    resultDetail: (matches) => `The closest meaning/word matches are ${matches.map((item) => `${item.raw} (${item.label})`).join(', ')}.`,
    emptyDetail: 'No sample word has a positive similarity score for this query.'
  };
}

function candidateVectorItems(items, query) {
  const sameLabel = items.filter((item) => item.label === query.label);
  const broadCandidates = items.filter((item) => (
    item.label === query.label ||
    cosineSimilarity(item.vector, query.vector) > 0.25
  ));
  const candidates = broadCandidates.length >= 3 ? broadCandidates : sameLabel;

  return (candidates.length ? candidates : items)
    .slice()
    .sort((a, b) => cosineSimilarity(b.vector, query.vector) - cosineSimilarity(a.vector, query.vector))
    .slice(0, Math.min(8, items.length));
}

function parseVectorItems(input) {
  const rawItems = Array.isArray(input)
    ? input.flatMap((item) => tokenizeText(item))
    : String(input || '').split(',').flatMap((item) => tokenizeText(item));
  const uniqueWords = [...new Set(rawItems)];

  return uniqueWords.map((raw, index) => buildVectorPoint(raw, false, index));
}

function buildVectorPoint(raw, isQuery = false, index = 0) {
  const vector = semanticVector(raw);
  const label = dominantVectorLabel(vector);
  const anchor = vectorAnchors[label] || vectorAnchors.general;
  const spread = pointSpread[index % pointSpread.length];
  const jitter = ((hashText(raw.toLowerCase()) % 5) - 2) * 0.8;

  return {
    id: isQuery ? 'query' : `v-${index}`,
    raw,
    label,
    vector,
    x: Math.max(8, Math.min(92, anchor.x + (isQuery ? 0 : spread.x + jitter))),
    y: Math.max(10, Math.min(90, anchor.y + (isQuery ? 0 : spread.y - jitter))),
    feature: label
  };
}

function parseKnnItems(input) {
  const rawItems = Array.isArray(input)
    ? input.map((item) => (
      typeof item === 'object' && item !== null
        ? {
          raw: String(item.text || item.raw || item.label || ''),
          label: item.label || item.category,
          category: item.category || item.label,
          features: normalizeKnnFeatures(item.features),
          explanation: item.explanation || ''
        }
        : { raw: String(item) }
    )).filter((item) => item.raw)
    : String(input || '').split(',').map((item) => ({ raw: item.trim() })).filter((item) => item.raw);
  const numericValues = rawItems.map((item) => Number(item.raw)).filter((value) => Number.isFinite(value));
  const numericMedian = numericValues.length
    ? [...numericValues].sort((a, b) => a - b)[Math.floor(numericValues.length / 2)]
    : 0;

  return rawItems.map((item, index) => {
    return buildKnnPoint(
      item.raw,
      item.label || getKnnLabel(item.raw, numericMedian),
      false,
      index,
      item.category,
      item.features,
      item.explanation
    );
  });
}

function buildKnnPoint(raw, label, isQuery = false, index = 0, knownCategory, knownFeatures, explanation = '') {
  const number = Number(raw);
  const features = knownFeatures || inferKnnFeatures(raw);
  const category = knownCategory || categoryFromFeatures(features);

  if (Number.isFinite(number)) {
    return {
      id: isQuery ? 'target' : `p-${index}`,
      raw,
      label,
      features,
      x: features.size * 10,
      y: 100 - features.nature * 10,
      feature: category,
      explanation
    };
  }

  return {
    id: isQuery ? 'target' : `p-${index}`,
    raw,
    label,
    features,
    x: features.size * 10,
    y: 100 - features.nature * 10,
    feature: category,
    explanation
  };
}

function normalizeKnnFeatures(features) {
  if (!features) return null;
  const normalized = {
    size: Number(features.size),
    nature: Number(features.nature),
    humanLike: Number(features.humanLike)
  };

  return Object.values(normalized).every((value) => Number.isFinite(value))
    ? normalized
    : null;
}

function inferKnnFeatures(raw) {
  const word = String(raw || '').toLowerCase().trim();
  const direct = knnFeatureDictionary[word];
  if (direct) return direct;

  return { size: 5, nature: 5, humanLike: 5 };
}

function featureDistance(a, b) {
  return Math.hypot(
    Number(a?.size || 0) - Number(b?.size || 0),
    Number(a?.nature || 0) - Number(b?.nature || 0),
    Number(a?.humanLike || 0) - Number(b?.humanLike || 0)
  );
}

function featureDistanceParts(a, b) {
  return [
    { label: 'size', diff: Number((Number(a?.size || 0) - Number(b?.size || 0)).toFixed(2)) },
    { label: 'nature', diff: Number((Number(a?.nature || 0) - Number(b?.nature || 0)).toFixed(2)) },
    { label: 'human-like', diff: Number((Number(a?.humanLike || 0) - Number(b?.humanLike || 0)).toFixed(2)) }
  ];
}

function formatFeatures(features) {
  return `[size ${features.size}, nature ${features.nature}, human-like ${features.humanLike}]`;
}

function getKnnVoteCounts(nearest) {
  const counts = nearest.reduce((acc, item) => {
    acc[item.label] = (acc[item.label] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

function formatVoteCounts(voteCounts) {
  return voteCounts.map((vote) => `${vote.label} ${vote.count}`).join(', ');
}

function categoryFromFeatures(features) {
  if (features.nature >= 7) return 'living';
  if (features.nature <= 3) return 'man-made';
  return 'unknown';
}

function getKnnLabel(raw, numericMedian) {
  const number = Number(raw);
  if (Number.isFinite(number)) return number >= numericMedian ? 'high' : 'low';
  const category = categoryFromFeatures(inferKnnFeatures(raw));
  if (category === 'living') return 'living thing';
  if (category === 'man-made') return 'man-made object';
  return 'unknown';
}

const knnFeatureDictionary = {
  cat: { size: 2, nature: 10, humanLike: 1 },
  dog: { size: 3, nature: 10, humanLike: 1 },
  lion: { size: 6, nature: 10, humanLike: 1 },
  fox: { size: 3, nature: 10, humanLike: 1 },
  wolf: { size: 4, nature: 10, humanLike: 1 },
  bird: { size: 2, nature: 10, humanLike: 1 },
  eagle: { size: 3, nature: 10, humanLike: 1 },
  human: { size: 5, nature: 10, humanLike: 10 },
  person: { size: 5, nature: 10, humanLike: 10 },
  king: { size: 5, nature: 9.5, humanLike: 10 },
  queen: { size: 5, nature: 9.5, humanLike: 10 },
  museum: { size: 9, nature: 1, humanLike: 2 },
  school: { size: 8, nature: 1, humanLike: 3 },
  library: { size: 8, nature: 1, humanLike: 3 },
  airplane: { size: 10, nature: 1, humanLike: 1 },
  drone: { size: 2, nature: 1, humanLike: 1 },
  car: { size: 4, nature: 1, humanLike: 1 }
};

function hashText(text) {
  return [...text].reduce((total, char) => total + char.charCodeAt(0), 0);
}

const semanticConcepts = {
  self: {
    positive: ['i', 'me', 'my', 'mine', 'myself', 'this', 'that', 'here', 'there'],
    negative: []
  },
  people: {
    positive: ['you', 'we', 'they', 'them', 'he', 'she', 'person', 'people', 'man', 'woman', 'child', 'friend', 'family', 'teacher', 'student', 'doctor', 'artist', 'king', 'queen', 'prince', 'princess', 'leader', 'team', 'human'],
    negative: []
  },
  emotion: {
    positive: ['love', 'like', 'happy', 'joy', 'kind', 'cute', 'smile', 'calm', 'brave', 'hope'],
    negative: ['hate', 'sad', 'angry', 'fear', 'cry', 'bad', 'lonely']
  },
  animal: {
    positive: ['animal', 'animals', 'pet', 'pets', 'cat', 'cats', 'dog', 'dogs', 'wolf', 'wolves', 'lion', 'tiger', 'elephant', 'horse', 'bird', 'fish', 'bear', 'zebra', 'monkey', 'rabbit', 'cow', 'sheep'],
    negative: []
  },
  food: {
    positive: ['apple', 'banana', 'orange', 'rice', 'bread', 'milk', 'water', 'fruit', 'meal', 'hungry', 'cook', 'eat', 'eating', 'food', 'tea', 'coffee', 'cake', 'meat', 'fish', 'vegetable', 'soup'],
    negative: []
  },
  vehicle: {
    positive: ['car', 'bus', 'train', 'airplane', 'plane', 'boat', 'ship', 'bicycle', 'bike', 'truck', 'drive', 'driving', 'fly', 'travel', 'ride', 'road', 'traffic', 'motorcycle', 'helicopter'],
    negative: []
  },
  place: {
    positive: ['home', 'house', 'school', 'museum', 'park', 'city', 'forest', 'zoo', 'library', 'airport', 'market', 'beach', 'river', 'mountain', 'room', 'street', 'garden', 'class', 'there', 'here', 'visit'],
    negative: []
  },
  learning: {
    positive: ['learn', 'study', 'class', 'book', 'code', 'math', 'science', 'lesson', 'homework', 'exam', 'teacher', 'student', 'library', 'school', 'read', 'write', 'computer', 'algorithm', 'data'],
    negative: []
  }
};

const vectorLabels = ['self', 'people', 'emotion', 'animal', 'food', 'vehicle', 'place', 'learning'];

const vectorAnchors = {
  self: { x: 44, y: 50 },
  people: { x: 58, y: 50 },
  emotion: { x: 50, y: 24 },
  animal: { x: 78, y: 24 },
  food: { x: 20, y: 24 },
  vehicle: { x: 22, y: 76 },
  place: { x: 78, y: 76 },
  learning: { x: 62, y: 78 },
  general: { x: 50, y: 50 }
};

const pointSpread = [
  { x: 0, y: -9 },
  { x: 10, y: 0 },
  { x: 0, y: 9 },
  { x: -10, y: 0 },
  { x: 8, y: -8 },
  { x: 8, y: 8 },
  { x: -8, y: 8 },
  { x: -8, y: -8 }
];

function semanticVector(text) {
  const words = tokenizeText(text);
  const scores = vectorLabels.map((label) => {
    const { positive, negative } = semanticConcepts[label];
    const positiveMatches = words.filter((word) => positive.includes(word)).length;
    const negativeMatches = words.filter((word) => negative.includes(word)).length;
    return (positiveMatches - negativeMatches) / Math.max(words.length, 1);
  });
  const hasSignal = scores.some((score) => score !== 0);
  return hasSignal ? scores : vectorLabels.map(() => 0.1);
}

function explainVectorMatch(item, query) {
  const dimensions = item.vector
    .map((value, index) => ({ label: vectorLabels[index], value, queryValue: query.vector[index] || 0 }))
    .filter((entry) => entry.value !== 0 && entry.queryValue !== 0)
    .sort((a, b) => Math.abs(b.value * b.queryValue) - Math.abs(a.value * a.queryValue));

  if (dimensions.length) {
    return dimensions.slice(0, 2).map((entry) => entry.label).join(' + ');
  }

  return item.label === 'general' ? 'general word shape' : item.label;
}

function tokenizeText(text) {
  return String(text).toLowerCase().match(/[a-z]+/g) || [];
}

function dominantVectorLabel(vector) {
  const magnitudes = vector.map((value) => Math.abs(value));
  const max = Math.max(...magnitudes);
  if (max <= 0.1) return 'general';
  return vectorLabels[magnitudes.indexOf(max)];
}

function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, value, index) => sum + value * b[index], 0);
  const magnitude = Math.hypot(...a) * Math.hypot(...b);
  return magnitude ? dot / magnitude : 0;
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
