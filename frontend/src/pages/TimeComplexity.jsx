const notations = [
  {
    title: 'Big O',
    label: 'Upper bound',
    example: 'O(n), O(n^2), O(log n)',
    text: 'Big O explains the maximum growth you should prepare for. It is commonly used to describe worst-case time.',
    calculate: 'Count the largest number of steps the algorithm can take, keep the fastest-growing term, and remove constants. Example: 3n + 10 becomes O(n).'
  },
  {
    title: 'Big Theta',
    label: 'Tight bound',
    example: 'Theta(n)',
    text: 'Big Theta means the upper and lower bounds match. The algorithm grows at this rate in a precise, practical sense.',
    calculate: 'Use Theta when best, average, and worst growth are the same shape. Example: a loop that always checks every item is Theta(n).'
  },
  {
    title: 'Big Omega',
    label: 'Lower bound',
    example: 'Omega(1), Omega(n)',
    text: 'Big Omega explains the minimum guaranteed growth. It is often used for best-case behavior.',
    calculate: 'Count the fewest steps the algorithm can take, then simplify the expression. Example: finding the target in the first box is Omega(1).'
  }
];

const complexityBasics = [
  {
    title: '1. Time complexity',
    label: 'Running work',
    example: 'Example: one loop over n items is O(n)',
    text: 'Time complexity describes how the number of operations grows when the input gets bigger. It helps you compare algorithms by their growth pattern instead of exact seconds.'
  },
  {
    title: '2. Space complexity',
    label: 'Memory use',
    example: 'Example: storing a new array of n items is O(n)',
    text: 'Space complexity describes how much extra memory an algorithm needs as the input grows. It counts new arrays, objects, recursion stacks, and other temporary storage.'
  }
];

const growthRates = [
  {
    notation: 'O(1)',
    name: 'Constant',
    example: 'Reading the first item in an array.',
    calculation: 'The step count does not grow with n. Whether n is 10 or 10,000, the algorithm still does one main action.'
  },
  {
    notation: 'O(log n)',
    name: 'Logarithmic',
    example: 'Binary search cutting the search area in half.',
    calculation: 'Count how many times n can be divided by 2 before it reaches 1. That count is log2(n), so the time is O(log n).'
  },
  {
    notation: 'O(n)',
    name: 'Linear',
    example: 'Checking every item once.',
    calculation: 'One loop over n items gives about n checks. Drop constants, so 2n or 5n still becomes O(n).'
  },
  {
    notation: 'O(n log n)',
    name: 'Linearithmic',
    example: 'Efficient sorting like merge sort.',
    calculation: 'There are log n levels of splitting, and each level processes n items. Multiply them: n * log n.'
  },
  {
    notation: 'O(n^2)',
    name: 'Quadratic',
    example: 'Nested loops comparing every pair.',
    calculation: 'A loop of n inside another loop of n gives n * n steps, which becomes O(n^2).'
  },
  {
    notation: 'O(2^n)',
    name: 'Exponential',
    example: 'Trying many possible subsets or combinations.',
    calculation: 'Each new input item doubles the number of possibilities. Doubling n times gives 2^n.'
  }
];

export function TimeComplexity() {
  return (
    <section className="page complexity-page">
      <div className="page-heading">
        <p className="eyebrow">Complexity guide</p>
        <h1>Time Complexity</h1>
        <p>
          Time complexity describes how many steps an algorithm needs as the input size grows. It does not measure exact
          seconds because computers run at different speeds; it measures the growth pattern of the work.
        </p>
      </div>

      <section className="complexity-basics">
        {complexityBasics.map((item) => (
          <article className="complexity-card" key={item.title}>
            <span>{item.label}</span>
            <h2>{item.title}</h2>
            <strong>{item.example}</strong>
            <p>{item.text}</p>
          </article>
        ))}
      </section>

      <section className="complexity-overview">
        {notations.map((item) => (
          <article className="complexity-card" key={item.title}>
            <span>{item.label}</span>
            <h2>{item.title}</h2>
            <strong>{item.example}</strong>
            <p>{item.text}</p>
            <p className="calculation-note">{item.calculate}</p>
          </article>
        ))}
      </section>

      <section className="complexity-split">
        <article className="panel">
          <p className="eyebrow">Time complexity</p>
          <h2>How to calculate time complexity</h2>
          <p>
            Count the repeated operations, write the step count as a formula using n, keep the term that grows fastest,
            then remove constants. A single loop is usually O(n). A nested loop over the same list is often O(n^2).
          </p>
          <pre>{`for (let i = 0; i < n; i++) {
  console.log(i)
}

// Time: O(n)`}</pre>
        </article>

        <article className="panel">
          <p className="eyebrow">Simplify rules</p>
          <h2>What to keep and what to remove</h2>
          <p>
            Remove fixed numbers and smaller terms because they matter less as n gets large. If an algorithm takes
            n^2 + 3n + 8 steps, the n^2 term grows fastest, so the time complexity is O(n^2).
          </p>
          <pre>{`n * n + 3 * n + 8

// Keep n * n
// Time: O(n^2)`}</pre>
        </article>
      </section>

      <section className="panel growth-panel">
        <div className="panel-title">
          <div>
            <p className="eyebrow">Common growth rates</p>
            <h2>From fastest to slowest</h2>
          </div>
        </div>
        <div className="growth-table">
          {growthRates.map(({ notation, name, example, calculation }) => (
            <div className="growth-row" key={notation}>
              <strong>{notation}</strong>
              <span>{name}</span>
              <p>
                {example}
                <em>{calculation}</em>
              </p>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
