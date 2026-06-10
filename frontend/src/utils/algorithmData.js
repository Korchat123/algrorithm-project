import { algorithms as assetAlgorithms, codeSamples as assetCodeSamples } from '../assets/algorithms.js';
import { api } from './api.js';

const languageKeys = {
  JavaScript: 'js',
  Python: 'python',
  Java: 'java',
  Go: 'go',
  Rust: 'rust',
  C: 'c',
  'C++': 'cpp'
};

export function mergeAlgorithm(remoteAlgorithm, fallbackAlgorithm) {
  if (!remoteAlgorithm) return fallbackAlgorithm;
  return {
    ...fallbackAlgorithm,
    ...remoteAlgorithm,
    bigO: {
      ...fallbackAlgorithm?.bigO,
      ...remoteAlgorithm.bigO
    }
  };
}

const supplementalAlgorithms = [
  {
    slug: 'ann',
    name: 'Approximate Nearest Neighbor (ANN)',
    category: 'machine-learning',
    detail: 'ANN narrows the search to a promising subset of vectors first, then ranks only those candidates. It trades a little accuracy for speed on large indexes.',
    summary: 'Finds nearby vectors by checking a smaller candidate set first.',
    bigO: { best: 'O(log n)', average: 'O(log n)', worst: 'O(n)', space: 'O(n)' },
    demo: {
      input: 'king, queen, teacher, student, love, happy, elephant, tiger, dog, cat, apple, bread, car, train, airplane, school, forest, library, learn, science',
      target: 'the king loves the elephant in the forest',
      note: 'A mixed sample gives ANN enough nearby clusters to narrow before ranking.'
    }
  },
  {
    slug: 'hnsw',
    name: 'HNSW',
    category: 'machine-learning',
    detail: 'HNSW builds a layered graph where high layers skip far across the space and lower layers refine the result. It is one of the most common ANN indexes.',
    summary: 'Uses layered graph links to jump quickly toward similar vectors.',
    bigO: { best: 'O(log n)', average: 'O(log n)', worst: 'O(n)', space: 'O(n log n)' },
    demo: {
      input: 'king, queen, teacher, student, love, happy, elephant, tiger, dog, cat, apple, bread, car, train, airplane, school, forest, library, learn, science',
      target: 'the king loves the elephant in the forest',
      note: 'The layered graph is easier to explain when the data spans several semantic groups.'
    }
  },
  {
    slug: 'kd-tree',
    name: 'K-d Tree',
    category: 'machine-learning',
    detail: 'A k-d tree recursively splits the vector space on one axis at a time, then searches the most promising side before backtracking to nearby branches.',
    summary: 'Partitions vectors with axis-aligned splits before checking neighbors.',
    bigO: { best: 'O(log n)', average: 'O(log n)', worst: 'O(n)', space: 'O(n)' },
    demo: {
      input: 'king, queen, teacher, student, love, happy, elephant, tiger, dog, cat, apple, bread, car, train, airplane, school, forest, library, learn, science',
      target: 'the king loves the elephant in the forest',
      note: 'Axis-based splits work best when the sample contains a few clear clusters.'
    }
  },
  {
    slug: 'brute-force-search',
    name: 'Brute Force Search',
    category: 'machine-learning',
    detail: 'Brute force search compares the query against every stored vector. It is simple and exact, but it becomes expensive as the dataset grows.',
    summary: 'Checks every vector and returns the closest matches.',
    bigO: { best: 'O(n*d)', average: 'O(n*d)', worst: 'O(n*d)', space: 'O(1)' },
    demo: {
      input: 'king, queen, teacher, student, love, happy, elephant, tiger, dog, cat, apple, bread, car, train, airplane, school, forest, library, learn, science',
      target: 'the king loves the elephant in the forest',
      note: 'The brute-force example uses the same sample set so its cost difference is obvious.'
    }
  }
];

const mergedFallbackAlgorithms = [
  ...assetAlgorithms.filter((algorithm) => algorithm.slug !== 'vector-search'),
  ...supplementalAlgorithms
];

const supplementalCodeSamples = {
  ann: {
    js: `function annSearch(index, queryVector, k = 3) {
  const candidates = index.findLikelyCluster(queryVector);
  return candidates
    .map((item) => ({
      ...item,
      similarity: cosineSimilarity(item.vector, queryVector)
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, k);
}`
  },
  hnsw: {
    js: `function hnswSearch(layers, queryVector, k = 3) {
  let entry = layers.at(-1)[0];
  for (let level = layers.length - 1; level >= 0; level--) {
    entry = greedySearch(layers[level], entry, queryVector);
  }
  return rankedNeighbors(entry, queryVector).slice(0, k);
}`
  },
  'kd-tree': {
    js: `function kdTreeSearch(tree, queryPoint, k = 3) {
  const best = [];
  searchNode(tree, queryPoint, best);
  return best.sort((a, b) => a.distance - b.distance).slice(0, k);
}`
  },
  'brute-force-search': {
    js: `function bruteForceSearch(items, queryVector, k = 3) {
  return items
    .map((item) => ({
      ...item,
      similarity: cosineSimilarity(item.vector, queryVector)
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, k);
}`
  }
};

export function mergeAlgorithmList(remoteAlgorithms) {
  if (!Array.isArray(remoteAlgorithms) || !remoteAlgorithms.length) {
    return mergedFallbackAlgorithms;
  }

  return remoteAlgorithms.map((algorithm) => {
    const fallback = mergedFallbackAlgorithms.find((item) => item.slug === algorithm.slug);
    return mergeAlgorithm(algorithm, fallback);
  });
}

export function samplesForAlgorithm(algorithm) {
  const localSamples = {
    ...(assetCodeSamples[algorithm.slug] || {}),
    ...(supplementalCodeSamples[algorithm.slug] || {})
  };
  const remoteSamples = Object.fromEntries(
    (algorithm.codeExamples || []).map((example) => [
      languageKeys[example.language] || example.language.toLowerCase(),
      example.code
    ])
  );

  return {
    ...localSamples,
    ...remoteSamples
  };
}

export async function fetchAlgorithms() {
  return mergeAlgorithmList(await api('/algorithms'));
}

export async function fetchAlgorithm(slug) {
  const fallback = mergedFallbackAlgorithms.find((item) => item.slug === slug) || mergedFallbackAlgorithms[0];
  return mergeAlgorithm(await api(`/algorithms/${slug}`), fallback);
}

export { mergedFallbackAlgorithms as fallbackAlgorithms };

export const semanticDimensions = [
  'living (+) / object (-)',
  'natural (+) / engineered (-)',
  'pleasant (+) / dangerous (-)',
  'moving (+) / stationary (-)',
  'small (+) / large (-)',
  'soft (+) / hard (-)',
  'edible (+) / utility (-)',
  'vehicle (+) / place-bound (-)'
];

const semanticItems = [
  { id: 1, text: 'cat', embedding: [0.95, 0.75, 0.65, 0.45, 0.55, 0.70, -0.30, -0.55] },
  { id: 2, text: 'dog', embedding: [0.96, 0.72, 0.78, 0.72, 0.35, 0.62, -0.28, -0.50] },
  { id: 3, text: 'bird', embedding: [0.92, 0.86, 0.48, 0.82, 0.72, 0.42, -0.35, -0.35] },
  { id: 4, text: 'rabbit', embedding: [0.94, 0.80, 0.70, 0.50, 0.82, 0.78, -0.25, -0.60] },
  { id: 5, text: 'elephant', embedding: [0.98, 0.88, 0.42, 0.18, -0.95, 0.28, -0.45, -0.72] },
  { id: 6, text: 'tiger', embedding: [0.98, 0.90, -0.45, 0.86, -0.62, 0.10, -0.52, -0.60] },
  { id: 7, text: 'fish', embedding: [0.90, 0.88, 0.20, 0.45, 0.35, 0.36, -0.18, -0.42] },
  { id: 8, text: 'hamster', embedding: [0.93, 0.66, 0.74, 0.32, 0.92, 0.84, -0.26, -0.68] },
  { id: 9, text: 'apple', embedding: [-0.18, 0.86, 0.68, -0.72, 0.70, 0.45, 0.95, -0.78] },
  { id: 10, text: 'pizza', embedding: [-0.35, -0.48, 0.78, -0.58, 0.25, 0.32, 0.98, -0.74] },
  { id: 11, text: 'bread', embedding: [-0.30, -0.25, 0.62, -0.68, 0.36, 0.60, 0.96, -0.78] },
  { id: 12, text: 'cheese', embedding: [-0.34, -0.36, 0.46, -0.72, 0.30, 0.50, 0.94, -0.76] },
  { id: 13, text: 'salad', embedding: [-0.22, 0.62, 0.70, -0.60, 0.48, 0.38, 0.95, -0.78] },
  { id: 14, text: 'pasta', embedding: [-0.36, -0.34, 0.66, -0.58, 0.28, 0.42, 0.96, -0.76] },
  { id: 15, text: 'banana', embedding: [-0.16, 0.82, 0.72, -0.64, 0.64, 0.48, 0.95, -0.78] },
  { id: 16, text: 'computer', embedding: [-0.92, -0.96, 0.18, -0.15, -0.35, -0.90, -0.92, -0.82] },
  { id: 17, text: 'phone', embedding: [-0.90, -0.94, 0.28, 0.20, 0.35, -0.76, -0.88, -0.38] },
  { id: 18, text: 'laptop', embedding: [-0.92, -0.95, 0.22, -0.02, -0.05, -0.84, -0.90, -0.68] },
  { id: 19, text: 'software', embedding: [-0.82, -0.98, 0.12, 0.05, 0.18, -0.92, -0.86, -0.88] },
  { id: 20, text: 'code', embedding: [-0.70, -0.94, 0.10, 0.18, 0.34, -0.88, -0.84, -0.90] },
  { id: 21, text: 'keyboard', embedding: [-0.94, -0.94, 0.08, -0.25, 0.22, -0.70, -0.96, -0.86] },
  { id: 22, text: 'mouse', embedding: [-0.88, -0.92, 0.12, -0.10, 0.58, -0.58, -0.90, -0.82] },
  { id: 23, text: 'router', embedding: [-0.94, -0.96, 0.04, -0.30, 0.05, -0.88, -0.92, -0.86] },
  { id: 24, text: 'car', embedding: [-0.96, -0.96, 0.20, 0.72, -0.60, -0.92, -0.76, 0.96] },
  { id: 25, text: 'bus', embedding: [-0.96, -0.94, 0.16, 0.55, -0.88, -0.90, -0.72, 0.98] },
  { id: 26, text: 'train', embedding: [-0.96, -0.94, 0.18, 0.78, -0.92, -0.94, -0.74, 0.98] },
  { id: 27, text: 'bike', embedding: [-0.70, -0.82, 0.55, 0.92, 0.18, -0.64, -0.58, 0.92] },
  { id: 28, text: 'airplane', embedding: [-0.96, -0.98, 0.22, 0.88, -0.92, -0.96, -0.76, 0.98] },
  { id: 29, text: 'truck', embedding: [-0.96, -0.96, 0.10, 0.66, -0.86, -0.92, -0.72, 0.98] },
  { id: 30, text: 'scooter', embedding: [-0.78, -0.88, 0.42, 0.86, 0.18, -0.62, -0.60, 0.94] }
];

const semanticQuerySeeds = [
  { text: 'friendly living things', embedding: [0.96, 0.76, 0.80, 0.48, 0.42, 0.66, -0.30, -0.58] },
  { text: 'dangerous wild animal', embedding: [0.98, 0.92, -0.78, 0.84, -0.50, -0.02, -0.48, -0.58] },
  { text: 'natural edible objects', embedding: [-0.22, 0.72, 0.68, -0.64, 0.54, 0.45, 0.98, -0.78] },
  { text: 'engineered utility objects', embedding: [-0.94, -0.96, 0.08, -0.08, -0.18, -0.86, -0.96, -0.78] },
  { text: 'fast moving vehicles', embedding: [-0.94, -0.94, 0.28, 0.90, -0.62, -0.88, -0.70, 0.98] }
];

export function cosineSimilarity(a, b) {
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    magnitudeA += a[i] * a[i];
    magnitudeB += b[i] * b[i];
  }

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
}

export function rankSemanticResults(embedding, limit = 5) {
  return semanticItems
    .map((item) => ({
      documentId: item.id,
      text: item.text,
      similarity: cosineSimilarity(embedding, item.embedding)
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
}

export function buildSemanticEmbedding(text) {
  const words = text.toLowerCase().match(/[a-z]+/g) || [];
  const embedding = Array(semanticDimensions.length).fill(0);

  const apply = (values) => {
    values.forEach((value, index) => {
      embedding[index] += value;
    });
  };

  const concepts = {
    living: [0.9, 0.5, 0.2, 0.2, 0.1, 0.4, -0.3, -0.4],
    animal: [1.0, 0.8, 0.2, 0.4, 0.1, 0.5, -0.3, -0.5],
    pet: [0.95, 0.55, 0.8, 0.35, 0.45, 0.75, -0.25, -0.55],
    creature: [1.0, 0.85, -0.1, 0.55, -0.15, 0.25, -0.4, -0.55],
    wild: [1.0, 0.9, -0.35, 0.8, -0.45, 0.05, -0.45, -0.55],
    object: [-0.95, -0.8, 0.05, -0.1, -0.2, -0.8, -0.75, -0.4],
    manmade: [-0.9, -0.95, 0.05, -0.08, -0.2, -0.82, -0.78, -0.3],
    engineered: [-0.92, -0.98, 0.08, 0.05, -0.2, -0.86, -0.82, -0.2],
    tool: [-0.95, -0.9, 0.0, -0.05, -0.05, -0.85, -0.95, -0.65],
    utility: [-0.95, -0.92, 0.08, -0.05, -0.1, -0.82, -0.98, -0.55],
    device: [-0.95, -0.95, 0.18, 0.05, 0.1, -0.85, -0.9, -0.65],
    tech: [-0.9, -0.98, 0.14, 0.08, 0.1, -0.9, -0.9, -0.82],
    technology: [-0.9, -0.98, 0.14, 0.08, 0.1, -0.9, -0.9, -0.82],
    food: [-0.25, 0.35, 0.65, -0.65, 0.45, 0.45, 1.0, -0.75],
    edible: [-0.22, 0.45, 0.62, -0.62, 0.45, 0.42, 1.0, -0.75],
    eat: [-0.2, 0.3, 0.55, -0.55, 0.35, 0.4, 1.0, -0.7],
    meal: [-0.3, 0.2, 0.7, -0.65, 0.3, 0.35, 1.0, -0.75],
    transport: [-0.95, -0.92, 0.2, 0.82, -0.6, -0.88, -0.68, 1.0],
    vehicle: [-0.95, -0.95, 0.2, 0.78, -0.62, -0.88, -0.68, 1.0],
    vehicles: [-0.95, -0.95, 0.2, 0.78, -0.62, -0.88, -0.68, 1.0],
    fast: [-0.35, -0.35, 0.25, 1.0, -0.35, -0.45, -0.2, 0.72],
    moving: [-0.25, -0.3, 0.18, 1.0, -0.2, -0.4, -0.25, 0.6],
    stationary: [-0.55, -0.72, 0.08, -1.0, -0.1, -0.75, -0.75, -1.0],
    active: [0.1, -0.25, 0.18, 0.9, -0.2, -0.35, -0.25, 0.55],
    passive: [-0.2, -0.3, 0.05, -0.9, 0.1, -0.2, -0.15, -0.3],
    good: [0.05, 0.1, 1.0, 0.2, 0.05, 0.25, 0.2, 0.0],
    happy: [0.1, 0.1, 1.0, 0.28, 0.15, 0.35, 0.1, 0.0],
    positive: [0.0, 0.0, 1.0, 0.12, 0.0, 0.2, 0.1, 0.0],
    bad: [0.0, 0.0, -1.0, 0.22, -0.1, -0.15, -0.1, 0.0],
    dangerous: [0.2, 0.25, -1.0, 0.62, -0.25, -0.25, -0.25, 0.05],
    scary: [0.2, 0.25, -1.0, 0.55, -0.25, -0.2, -0.25, 0.0],
    negative: [0.0, 0.0, -1.0, 0.1, -0.1, -0.1, -0.1, 0.0],
    small: [0.0, 0.0, 0.1, 0.1, 1.0, 0.2, 0.1, -0.2],
    large: [0.0, 0.0, 0.0, 0.05, -1.0, -0.1, -0.1, 0.2],
    soft: [0.05, 0.0, 0.2, -0.1, 0.1, 1.0, 0.2, -0.2],
    hard: [-0.4, -0.5, 0.0, -0.1, -0.15, -1.0, -0.5, -0.2]
  };

  words.forEach((word) => {
    if (concepts[word]) apply(concepts[word]);
  });

  const magnitude = Math.sqrt(embedding.reduce((sum, value) => sum + value * value, 0));
  if (magnitude === 0) return [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1];

  return embedding.map((value) => value / magnitude);
}

export const semanticSearchData = {
  data: semanticItems,
  queries: semanticQuerySeeds.map((query) => ({
    ...query,
    results: rankSemanticResults(query.embedding)
  }))
};
