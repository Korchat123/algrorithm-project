export const knnExamples = [
  {
    text: 'cat',
    label: 'living thing',
    category: 'living',
    features: { size: 2, nature: 10, humanLike: 1 },
    explanation: 'Small, fully living, not human-like.'
  },
  {
    text: 'dog',
    label: 'living thing',
    category: 'living',
    features: { size: 3, nature: 10, humanLike: 1 },
    explanation: 'Small-medium, fully living, not human-like.'
  },
  {
    text: 'lion',
    label: 'living thing',
    category: 'living',
    features: { size: 6, nature: 10, humanLike: 1 },
    explanation: 'Medium-large, fully living, not human-like.'
  },
  {
    text: 'human',
    label: 'living thing',
    category: 'living',
    features: { size: 5, nature: 10, humanLike: 10 },
    explanation: 'Medium size, fully living, strongly human-like.'
  },
  {
    text: 'king',
    label: 'living thing',
    category: 'living',
    features: { size: 5, nature: 9.5, humanLike: 10 },
    explanation: 'A human role, so it stays near human and queen.'
  },
  {
    text: 'queen',
    label: 'living thing',
    category: 'living',
    features: { size: 5, nature: 9.5, humanLike: 10 },
    explanation: 'A human role, so it stays near human and king.'
  },
  {
    text: 'museum',
    label: 'man-made object',
    category: 'man-made',
    features: { size: 9, nature: 1, humanLike: 2 },
    explanation: 'Very large and man-made.'
  },
  {
    text: 'airplane',
    label: 'man-made object',
    category: 'man-made',
    features: { size: 10, nature: 1, humanLike: 1 },
    explanation: 'Extremely large and man-made.'
  }
];
