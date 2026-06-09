export const algorithms = [
  { slug: 'linear-search', name: 'Linear Search', category: 'search', detail: 'Linear search is the simplest way to find a value. It checks the first item, then the next item, and continues until it finds the target or reaches the end.', summary: 'Checks values from left to right until a target appears.', bigO: { best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' } },
  { slug: 'binary-search', name: 'Binary Search', category: 'search', detail: 'Binary search works only on sorted data. It checks the middle value, removes the half that cannot contain the target, and repeats on the remaining half.', summary: 'Cuts a sorted list in half after each comparison.', bigO: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)' } },
  { slug: 'jump-search', name: 'Jump Search', category: 'search', detail: 'Jump search works on sorted data by moving forward in fixed-size blocks. After it passes the target range, it scans inside that smaller block.', summary: 'Jumps by blocks, then scans the likely block.', bigO: { best: 'O(1)', average: 'O(sqrt n)', worst: 'O(sqrt n)', space: 'O(1)' } },
  { slug: 'interpolation-search', name: 'Interpolation Search', category: 'search', detail: 'Interpolation search guesses where the target should be based on the target value. It is strongest when sorted numbers are spread evenly.', summary: 'Estimates where the target should be in evenly spaced sorted data.', bigO: { best: 'O(1)', average: 'O(log log n)', worst: 'O(n)', space: 'O(1)' } },
  { slug: 'bubble-sort', name: 'Bubble Sort', category: 'sort', detail: 'Bubble sort repeatedly compares neighboring items and swaps them when they are out of order. Large values slowly move toward the end after each pass.', summary: 'Swaps adjacent values until larger values bubble to the end.', bigO: { best: 'O(n)', average: 'O(n^2)', worst: 'O(n^2)', space: 'O(1)' } },
  { slug: 'selection-sort', name: 'Selection Sort', category: 'sort', detail: 'Selection sort finds the smallest remaining item and places it into the next sorted position. It makes few swaps but still scans a lot.', summary: 'Places the smallest remaining value into the next sorted slot.', bigO: { best: 'O(n^2)', average: 'O(n^2)', worst: 'O(n^2)', space: 'O(1)' } },
  { slug: 'merge-sort', name: 'Merge Sort', category: 'sort', detail: 'Merge sort splits the list into smaller lists, sorts each piece, then merges the pieces back together in order. It is reliable for large data.', summary: 'Divides data, sorts pieces, and merges them in order.', bigO: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' } },
  { slug: 'quick-sort', name: 'Quicksort', category: 'sort', detail: 'Quicksort chooses a pivot, moves smaller values to one side and larger values to the other, then sorts each side. Good pivots make it very fast.', summary: 'Uses a pivot to partition smaller and larger values.', bigO: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n^2)', space: 'O(log n)' } },
  { slug: 'bucket-sort', name: 'Bucket Sort', category: 'sort', detail: 'Bucket sort places values into groups called buckets, sorts each bucket, then joins the buckets together. It works best when data is evenly distributed.', summary: 'Groups values into buckets before sorting and joining them.', bigO: { best: 'O(n + k)', average: 'O(n + k)', worst: 'O(n^2)', space: 'O(n + k)' } },
  { slug: 'heap-sort', name: 'Heapsort', category: 'sort', detail: 'Heapsort turns the data into a heap structure so the largest value can be removed efficiently. It repeats this until everything is sorted.', summary: 'Builds a heap, then repeatedly moves the max value into place.', bigO: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)' } },
  { slug: 'bfs', name: 'Breadth-First Search', category: 'graph', detail: 'Breadth-first search explores a graph level by level. It visits all nearby nodes first before moving farther away from the start.', summary: 'Explores graph nodes by distance from the start node.', bigO: { best: 'O(1)', average: 'O(V + E)', worst: 'O(V + E)', space: 'O(V)' } },
  { slug: 'dfs', name: 'Depth-First Search', category: 'graph', detail: 'Depth-first search follows one path as deep as possible before backtracking. It is useful for exploring branches, paths, and connected areas.', summary: 'Explores one branch deeply before backtracking.', bigO: { best: 'O(1)', average: 'O(V + E)', worst: 'O(V + E)', space: 'O(V)' } },
  { slug: 'knn', name: 'K-Nearest Neighbors', category: 'machine-learning', detail: 'KNN stores known examples, maps a new target into the same feature space, then lets the closest examples vote for the target class.', summary: 'Predicts from the nearest labeled examples.', bigO: { best: 'O(n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' } },
  { slug: 'vector-search', name: 'Vector Search', category: 'machine-learning', detail: 'Vector search converts items into numeric vectors and compares them by distance or similarity. It is commonly used for semantic search and recommendations.', summary: 'Ranks items by similarity between numeric vectors.', bigO: { best: 'O(d)', average: 'O(n*d)', worst: 'O(n*d)', space: 'O(n*d)' } }
];

export const codeSamples = {
  'linear-search': {
    js: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}`,
    python: `def linear_search(arr, target):
    for i, value in enumerate(arr):
        if value == target:
            return i
    return -1`
  },
  'binary-search': {
    js: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
    python: `def binary_search(arr, target):
    left = 0
    right = len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        if arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,
    java: `int binarySearch(int[] arr, int target) {
  int left = 0, right = arr.length - 1;
  while (left <= right) {
    int mid = left + (right - left) / 2;
    if (arr[mid] == target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
    go: `func binarySearch(arr []int, target int) int {
  left, right := 0, len(arr)-1
  for left <= right {
    mid := left + (right-left)/2
    if arr[mid] == target { return mid }
    if arr[mid] < target { left = mid + 1 } else { right = mid - 1 }
  }
  return -1
}`,
    rust: `fn binary_search(arr: &[i32], target: i32) -> Option<usize> {
  let (mut left, mut right) = (0, arr.len());
  while left < right {
    let mid = left + (right - left) / 2;
    if arr[mid] == target { return Some(mid); }
    if arr[mid] < target { left = mid + 1; } else { right = mid; }
  }
  None
}`
  },
  'jump-search': {
    js: `function jumpSearch(arr, target) {
  const step = Math.floor(Math.sqrt(arr.length));
  let start = 0;
  let end = step;

  while (arr[Math.min(end, arr.length) - 1] < target) {
    start = end;
    end += step;
    if (start >= arr.length) return -1;
  }

  for (let i = start; i < Math.min(end, arr.length); i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}`,
    python: `import math

def jump_search(arr, target):
    step = int(math.sqrt(len(arr)))
    start = 0
    end = step

    while arr[min(end, len(arr)) - 1] < target:
        start = end
        end += step
        if start >= len(arr):
            return -1

    for i in range(start, min(end, len(arr))):
        if arr[i] == target:
            return i
    return -1`
  },
  'interpolation-search': {
    js: `function interpolationSearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;

  while (low <= high && target >= arr[low] && target <= arr[high]) {
    if (arr[low] === arr[high]) return arr[low] === target ? low : -1;
    const pos = low + Math.floor(((target - arr[low]) * (high - low)) / (arr[high] - arr[low]));
    if (arr[pos] === target) return pos;
    if (arr[pos] < target) low = pos + 1;
    else high = pos - 1;
  }
  return -1;
}`,
    python: `def interpolation_search(arr, target):
    low = 0
    high = len(arr) - 1

    while low <= high and arr[low] <= target <= arr[high]:
        if arr[low] == arr[high]:
            return low if arr[low] == target else -1
        pos = low + ((target - arr[low]) * (high - low)) // (arr[high] - arr[low])
        if arr[pos] == target:
            return pos
        if arr[pos] < target:
            low = pos + 1
        else:
            high = pos - 1
    return -1`
  },
  'bubble-sort': {
    js: `function bubbleSort(arr) {
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
  },
  'selection-sort': {
    js: `function selectionSort(arr) {
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
  },
  'merge-sort': {
    js: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  const merged = [];

  while (left.length && right.length) {
    merged.push(left[0] <= right[0] ? left.shift() : right.shift());
  }
  return merged.concat(left, right);
}`
  },
  'quick-sort': {
    js: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low >= high) return arr;
  const pivot = arr[high];
  let left = low;

  for (let i = low; i < high; i++) {
    if (arr[i] < pivot) {
      const temp = arr[left];
      arr[left] = arr[i];
      arr[i] = temp;
      left++;
    }
  }

  const temp = arr[left];
  arr[left] = arr[high];
  arr[high] = temp;

  quickSort(arr, low, left - 1);
  quickSort(arr, left + 1, high);
  return arr;
}`
  },
  'bucket-sort': {
    js: `function bucketSort(arr, bucketCount = 5) {
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const buckets = Array.from({ length: bucketCount }, () => []);

  for (const value of arr) {
    const index = Math.min(bucketCount - 1, Math.floor(((value - min) / (max - min + 1)) * bucketCount));
    buckets[index].push(value);
  }

  return buckets.flatMap((bucket) => bucket.sort((a, b) => a - b));
}`
  },
  'heap-sort': {
    js: `function heapSort(arr) {
  const copy = [...arr];

  function heapify(size, root) {
    let largest = root;
    const left = 2 * root + 1;
    const right = 2 * root + 2;
    if (left < size && copy[left] > copy[largest]) largest = left;
    if (right < size && copy[right] > copy[largest]) largest = right;
    if (largest !== root) {
      [copy[root], copy[largest]] = [copy[largest], copy[root]];
      heapify(size, largest);
    }
  }

  for (let i = Math.floor(copy.length / 2) - 1; i >= 0; i--) heapify(copy.length, i);
  for (let i = copy.length - 1; i > 0; i--) {
    [copy[0], copy[i]] = [copy[i], copy[0]];
    heapify(i, 0);
  }
  return copy;
}`
  },
  bfs: {
    js: `function bfs(graph, start) {
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
  },
  dfs: {
    js: `function dfs(graph, start, visited = new Set(), order = []) {
  visited.add(start);
  order.push(start);

  for (const next of graph[start]) {
    if (!visited.has(next)) dfs(graph, next, visited, order);
  }
  return order;
}`
  },
  knn: {
    js: `function knn(items, target, k = 3) {
  const points = items.map(toPoint);
  const query = toPoint(target, 'target');

  const ranked = points.map((point) => ({
    ...point,
    distance: Math.hypot(point.x - query.x, point.y - query.y)
  })).sort((a, b) => a.distance - b.distance);

  const nearest = ranked.slice(0, k);
  return vote(nearest);
}

function toPoint(raw, id = raw) {
  const category = getCategory(raw);
  const anchors = {
    fruit: [20, 24],
    animal: [78, 24],
    vehicle: [22, 76],
    place: [78, 76],
    text: [50, 50]
  };
  const [x, y] = anchors[category] || anchors.text;
  return { id, raw, label: category, x, y };
}

function vote(nearest) {
  const counts = {};
  for (const point of nearest) counts[point.label] = (counts[point.label] || 0) + 1;
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}`
  },
  'vector-search': {
    js: `function vectorSearch(items, queryText, limit = 3) {
  const vectors = items.map(toVector);
  const query = toVector(queryText);

  const ranked = vectors.map((item) => ({
    ...item,
    similarity: cosineSimilarity(item.vector, query.vector)
  })).sort((a, b) => b.similarity - a.similarity);

  return ranked.filter((item) => item.similarity > 0).slice(0, limit);
}

function toVector(text) {
  const words = tokenize(text);
  const concepts = {
    self: { pos: ['i', 'me', 'my'], neg: [] },
    people: { pos: ['you', 'we', 'teacher', 'student'], neg: [] },
    emotion: { pos: ['love', 'like', 'happy'], neg: ['hate', 'sad'] },
    pet: { pos: ['dog', 'cat', 'pet', 'animal'], neg: [] },
    food: { pos: ['apple', 'banana', 'fruit', 'eat', 'food'], neg: [] },
    vehicle: { pos: ['car', 'drive', 'airplane', 'fly', 'bicycle'], neg: [] },
    place: { pos: ['museum', 'school', 'home', 'park', 'library'], neg: [] },
    learning: { pos: ['school', 'teacher', 'student', 'study', 'learn'], neg: [] }
  };
  const vector = Object.values(concepts).map(({ pos, neg }) =>
    (pos.filter((term) => words.includes(term)).length -
    neg.filter((term) => words.includes(term)).length) / Math.max(words.length, 1)
  );
  return { text, vector };
}

function tokenize(text) {
  return text.toLowerCase().match(/[a-z]+/g) || [];
}

function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, value, i) => sum + value * b[i], 0);
  const magnitude = Math.hypot(...a) * Math.hypot(...b);
  return magnitude ? dot / magnitude : 0;
}`
  }
};
