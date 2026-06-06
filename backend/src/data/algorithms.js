export const algorithms = [
  {
    slug: 'linear-search',
    name: 'Linear Search',
    category: 'search',
    summary: 'Checks each item one by one until the target is found or the list ends.',
    bigO: { best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
    codeExamples: [
      {
        language: 'JavaScript',
        code: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}`
      },
      {
        language: 'Python',
        code: `def linear_search(arr, target):
    for i, value in enumerate(arr):
        if value == target:
            return i
    return -1`
      }
    ]
  },
  {
    slug: 'binary-search',
    name: 'Binary Search',
    category: 'search',
    summary: 'Repeatedly halves a sorted search space to find a target value.',
    bigO: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)' },
    codeExamples: [
      {
        language: 'JavaScript',
        code: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`
      },
      {
        language: 'C++',
        code: `int binarySearch(vector<int>& arr, int target) {
  int left = 0, right = arr.size() - 1;
  while (left <= right) {
    int mid = left + (right - left) / 2;
    if (arr[mid] == target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`
      }
    ]
  },
  {
    slug: 'jump-search',
    name: 'Jump Search',
    category: 'search',
    summary: 'Skips forward by block size, then linearly scans inside the likely block.',
    bigO: { best: 'O(1)', average: 'O(sqrt n)', worst: 'O(sqrt n)', space: 'O(1)' },
    codeExamples: [
      {
        language: 'JavaScript',
        code: `function jumpSearch(arr, target) {
  const step = Math.floor(Math.sqrt(arr.length));
  let blockStart = 0;
  let blockEnd = step;
  while (arr[Math.min(blockEnd, arr.length) - 1] < target) {
    blockStart = blockEnd;
    blockEnd += step;
    if (blockStart >= arr.length) return -1;
  }
  for (let i = blockStart; i < Math.min(blockEnd, arr.length); i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}`
      }
    ]
  },
  {
    slug: 'interpolation-search',
    name: 'Interpolation Search',
    category: 'search',
    summary: 'Estimates the likely target position in sorted, evenly distributed data.',
    bigO: { best: 'O(1)', average: 'O(log log n)', worst: 'O(n)', space: 'O(1)' },
    codeExamples: [
      {
        language: 'JavaScript',
        code: `function interpolationSearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;
  while (low <= high && target >= arr[low] && target <= arr[high]) {
    if (arr[high] === arr[low]) return arr[low] === target ? low : -1;
    const pos = low + Math.floor(((target - arr[low]) * (high - low)) / (arr[high] - arr[low]));
    if (arr[pos] === target) return pos;
    if (arr[pos] < target) low = pos + 1;
    else high = pos - 1;
  }
  return -1;
}`
      }
    ]
  },
  {
    slug: 'bubble-sort',
    name: 'Bubble Sort',
    category: 'sort',
    summary: 'Repeatedly swaps adjacent out-of-order items until the array is sorted.',
    bigO: { best: 'O(n)', average: 'O(n^2)', worst: 'O(n^2)', space: 'O(1)' },
    codeExamples: [
      {
        language: 'JavaScript',
        code: `function bubbleSort(arr) {
  const copy = [...arr];
  for (let i = 0; i < copy.length - 1; i++) {
    for (let j = 0; j < copy.length - i - 1; j++) {
      if (copy[j] > copy[j + 1]) {
        [copy[j], copy[j + 1]] = [copy[j + 1], copy[j]];
      }
    }
  }
  return copy;
}`
      }
    ]
  },
  {
    slug: 'selection-sort',
    name: 'Selection Sort',
    category: 'sort',
    summary: 'Selects the smallest remaining item and moves it to the sorted side.',
    bigO: { best: 'O(n^2)', average: 'O(n^2)', worst: 'O(n^2)', space: 'O(1)' },
    codeExamples: [
      {
        language: 'JavaScript',
        code: `function selectionSort(arr) {
  const copy = [...arr];
  for (let i = 0; i < copy.length; i++) {
    let min = i;
    for (let j = i + 1; j < copy.length; j++) {
      if (copy[j] < copy[min]) min = j;
    }
    [copy[i], copy[min]] = [copy[min], copy[i]];
  }
  return copy;
}`
      }
    ]
  },
  {
    slug: 'merge-sort',
    name: 'Merge Sort',
    category: 'sort',
    summary: 'Splits data into halves, sorts the halves, and merges them back together.',
    bigO: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
    codeExamples: [
      {
        language: 'JavaScript',
        code: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  const result = [];
  while (left.length && right.length) {
    result.push(left[0] <= right[0] ? left.shift() : right.shift());
  }
  return result.concat(left, right);
}`
      }
    ]
  },
  {
    slug: 'quick-sort',
    name: 'Quicksort',
    category: 'sort',
    summary: 'Partitions around a pivot, then recursively sorts each side.',
    bigO: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n^2)', space: 'O(log n)' },
    codeExamples: [
      {
        language: 'JavaScript',
        code: `function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const [pivot, ...rest] = arr;
  return [
    ...quickSort(rest.filter((x) => x < pivot)),
    pivot,
    ...quickSort(rest.filter((x) => x >= pivot))
  ];
}`
      }
    ]
  },
  {
    slug: 'heap-sort',
    name: 'Heapsort',
    category: 'sort',
    summary: 'Builds a heap and repeatedly extracts the largest item into sorted position.',
    bigO: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)' },
    codeExamples: [
      {
        language: 'JavaScript',
        code: `function heapSort(arr) {
  const copy = [...arr];
  const heapify = (size, root) => {
    let largest = root;
    const left = 2 * root + 1;
    const right = 2 * root + 2;
    if (left < size && copy[left] > copy[largest]) largest = left;
    if (right < size && copy[right] > copy[largest]) largest = right;
    if (largest !== root) {
      [copy[root], copy[largest]] = [copy[largest], copy[root]];
      heapify(size, largest);
    }
  };
  for (let i = Math.floor(copy.length / 2) - 1; i >= 0; i--) heapify(copy.length, i);
  for (let i = copy.length - 1; i > 0; i--) {
    [copy[0], copy[i]] = [copy[i], copy[0]];
    heapify(i, 0);
  }
  return copy;
}`
      }
    ]
  },
  {
    slug: 'bucket-sort',
    name: 'Bucket Sort',
    category: 'sort',
    summary: 'Distributes values into buckets, sorts each bucket, then joins the buckets.',
    bigO: { best: 'O(n + k)', average: 'O(n + k)', worst: 'O(n^2)', space: 'O(n + k)' },
    codeExamples: [
      {
        language: 'JavaScript',
        code: `function bucketSort(arr, bucketCount = 5) {
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const buckets = Array.from({ length: bucketCount }, () => []);
  for (const value of arr) {
    const index = Math.min(bucketCount - 1, Math.floor(((value - min) / (max - min + 1)) * bucketCount));
    buckets[index].push(value);
  }
  return buckets.flatMap((bucket) => bucket.sort((a, b) => a - b));
}`
      }
    ]
  },
  {
    slug: 'bfs',
    name: 'Breadth-First Search',
    category: 'graph',
    summary: 'Visits graph nodes level by level using a queue.',
    bigO: { best: 'O(1)', average: 'O(V + E)', worst: 'O(V + E)', space: 'O(V)' },
    codeExamples: [
      {
        language: 'JavaScript',
        code: `function bfs(graph, start) {
  const queue = [start];
  const visited = new Set([start]);
  const order = [];
  while (queue.length) {
    const node = queue.shift();
    order.push(node);
    for (const next of graph[node]) {
      if (!visited.has(next)) {
        visited.add(next);
        queue.push(next);
      }
    }
  }
  return order;
}`
      }
    ]
  },
  {
    slug: 'dfs',
    name: 'Depth-First Search',
    category: 'graph',
    summary: 'Follows one path deeply before backtracking to try another branch.',
    bigO: { best: 'O(1)', average: 'O(V + E)', worst: 'O(V + E)', space: 'O(V)' },
    codeExamples: [
      {
        language: 'JavaScript',
        code: `function dfs(graph, start, visited = new Set(), order = []) {
  visited.add(start);
  order.push(start);
  for (const next of graph[start]) {
    if (!visited.has(next)) dfs(graph, next, visited, order);
  }
  return order;
}`
      }
    ]
  },
  {
    slug: 'knn',
    name: 'K-Nearest Neighbors',
    category: 'machine-learning',
    summary: 'Classifies a point by looking at the labels of the closest known points.',
    bigO: { best: 'O(n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
    codeExamples: [
      {
        language: 'JavaScript',
        code: `function knn(points, target, k) {
  return points
    .map((point) => ({
      ...point,
      distance: Math.hypot(point.x - target.x, point.y - target.y)
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, k);
}`
      }
    ]
  },
  {
    slug: 'vector-search',
    name: 'Vector Search',
    category: 'machine-learning',
    summary: 'Finds similar items by comparing numeric embedding vectors.',
    bigO: { best: 'O(d)', average: 'O(n*d)', worst: 'O(n*d)', space: 'O(n*d)' },
    codeExamples: [
      {
        language: 'JavaScript',
        code: `function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, value, i) => sum + value * b[i], 0);
  const magA = Math.hypot(...a);
  const magB = Math.hypot(...b);
  return dot / (magA * magB);
}`
      }
    ]
  }
];
