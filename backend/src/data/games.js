export const gamesData = [
  {
    slug: 'sort-race',
    title: 'Sort Race',
    type: 'game',
    prompt: 'Swap tiles into ascending order.',
    levels: [
      { level: 1, points: 10, params: { size: 4, type: 'number' } },
      { level: 2, points: 20, params: { size: 6, type: 'number' } },
      { level: 3, points: 30, params: { size: 6, type: 'text' } },
      { level: 4, points: 40, params: { size: 8, type: 'number' } },
      { level: 5, points: 50, params: { size: 10, type: 'number' } }
    ]
  },
  {
    slug: 'more-or-less',
    title: 'More or Less',
    type: 'game',
    prompt: 'Guess the hidden number with hints.',
    levels: [
      { level: 1, points: 10, params: { range: 20 } },
      { level: 2, points: 20, params: { range: 50 } },
      { level: 3, points: 30, params: { range: 100 } },
      { level: 4, points: 40, params: { range: 500 } },
      { level: 5, points: 50, params: { range: 1000 } }
    ]
  },
  {
    slug: 'hanoi',
    title: 'Tower of Hanoi',
    type: 'game',
    prompt: 'Move disks to the target tower.',
    levels: [
      { level: 1, points: 20, params: { disks: 3 } },
      { level: 2, points: 40, params: { disks: 4 } },
      { level: 3, points: 60, params: { disks: 5 } },
      { level: 4, points: 80, params: { disks: 6 } },
      { level: 5, points: 100, params: { disks: 7 } }
    ]
  },
  {
    slug: 'build-sorted',
    title: 'Build Sorted List',
    type: 'game',
    prompt: 'Pick the smallest remaining item.',
    levels: [
      { level: 1, points: 10, params: { size: 5 } },
      { level: 2, points: 20, params: { size: 7 } },
      { level: 3, points: 30, params: { size: 10 } },
      { level: 4, points: 40, params: { size: 12 } },
      { level: 5, points: 50, params: { size: 15 } }
    ]
  },
  {
    slug: 'hidden-search',
    title: 'Find Hidden Number',
    type: 'game',
    prompt: 'Find the target in hidden boxes.',
    levels: [
      { level: 1, points: 10, params: { size: 5 } },
      { level: 2, points: 20, params: { size: 10 } },
      { level: 3, points: 30, params: { size: 15 } },
      { level: 4, points: 40, params: { size: 20 } },
      { level: 5, points: 50, params: { size: 25 } }
    ]
  }
];
