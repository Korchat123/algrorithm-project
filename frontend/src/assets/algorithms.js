export const algorithms = [
  { slug: 'linear-search', name: 'Linear Search', category: 'search', summary: 'Checks values from left to right until a target appears.', bigO: { best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' } },
  { slug: 'binary-search', name: 'Binary Search', category: 'search', summary: 'Cuts a sorted list in half after each comparison.', bigO: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)' } },
  { slug: 'jump-search', name: 'Jump Search', category: 'search', summary: 'Jumps by blocks, then scans the likely block.', bigO: { best: 'O(1)', average: 'O(sqrt n)', worst: 'O(sqrt n)', space: 'O(1)' } },
  { slug: 'interpolation-search', name: 'Interpolation Search', category: 'search', summary: 'Estimates where the target should be in evenly spaced sorted data.', bigO: { best: 'O(1)', average: 'O(log log n)', worst: 'O(n)', space: 'O(1)' } },
  { slug: 'bubble-sort', name: 'Bubble Sort', category: 'sort', summary: 'Swaps adjacent values until larger values bubble to the end.', bigO: { best: 'O(n)', average: 'O(n^2)', worst: 'O(n^2)', space: 'O(1)' } },
  { slug: 'selection-sort', name: 'Selection Sort', category: 'sort', summary: 'Places the smallest remaining value into the next sorted slot.', bigO: { best: 'O(n^2)', average: 'O(n^2)', worst: 'O(n^2)', space: 'O(1)' } },
  { slug: 'merge-sort', name: 'Merge Sort', category: 'sort', summary: 'Divides data, sorts pieces, and merges them in order.', bigO: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' } },
  { slug: 'quick-sort', name: 'Quicksort', category: 'sort', summary: 'Uses a pivot to partition smaller and larger values.', bigO: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n^2)', space: 'O(log n)' } },
  { slug: 'bucket-sort', name: 'Bucket Sort', category: 'sort', summary: 'Groups values into buckets before sorting and joining them.', bigO: { best: 'O(n + k)', average: 'O(n + k)', worst: 'O(n^2)', space: 'O(n + k)' } },
  { slug: 'heap-sort', name: 'Heapsort', category: 'sort', summary: 'Builds a heap, then repeatedly moves the max value into place.', bigO: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)' } },
  { slug: 'bfs', name: 'Breadth-First Search', category: 'graph', summary: 'Explores graph nodes by distance from the start node.', bigO: { best: 'O(1)', average: 'O(V + E)', worst: 'O(V + E)', space: 'O(V)' } },
  { slug: 'dfs', name: 'Depth-First Search', category: 'graph', summary: 'Explores one branch deeply before backtracking.', bigO: { best: 'O(1)', average: 'O(V + E)', worst: 'O(V + E)', space: 'O(V)' } },
  { slug: 'knn', name: 'K-Nearest Neighbors', category: 'machine-learning', summary: 'Predicts from the nearest labeled examples.', bigO: { best: 'O(n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' } },
  { slug: 'vector-search', name: 'Vector Search', category: 'machine-learning', summary: 'Ranks items by similarity between numeric vectors.', bigO: { best: 'O(d)', average: 'O(n*d)', worst: 'O(n*d)', space: 'O(n*d)' } }
];

export const codeSamples = {
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
};
