const notations = [
  {
    title: 'Big O',
    label: 'Upper bound',
    example: 'O(n), O(n^2), O(log n)',
    text: 'Big O explains the maximum growth you should prepare for. It is commonly used to describe worst-case time or space.'
  },
  {
    title: 'Big Theta',
    label: 'Tight bound',
    example: 'Theta(n)',
    text: 'Big Theta means the upper and lower bounds match. The algorithm grows at this rate in a precise, practical sense.'
  },
  {
    title: 'Big Omega',
    label: 'Lower bound',
    example: 'Omega(1), Omega(n)',
    text: 'Big Omega explains the minimum guaranteed growth. It is often used for best-case behavior.'
  }
];

const growthRates = [
  ['O(1)', 'Constant', 'Reading the first item in an array.'],
  ['O(log n)', 'Logarithmic', 'Binary search cutting the search area in half.'],
  ['O(n)', 'Linear', 'Checking every item once.'],
  ['O(n log n)', 'Linearithmic', 'Efficient sorting like merge sort.'],
  ['O(n^2)', 'Quadratic', 'Nested loops comparing every pair.'],
  ['O(2^n)', 'Exponential', 'Trying many possible subsets or combinations.']
];

export function TimeComplexity() {
  return (
    <section className="page complexity-page">
      <div className="page-heading">
        <p className="eyebrow">Complexity guide</p>
        <h1>Big O, Big Theta, Big Omega, time, and space.</h1>
        <p>
          Complexity notation describes how an algorithm grows when input size grows. It does not measure exact seconds;
          it shows the shape of the cost.
        </p>
      </div>

      <section className="complexity-overview">
        {notations.map((item) => (
          <article className="complexity-card" key={item.title}>
            <span>{item.label}</span>
            <h2>{item.title}</h2>
            <strong>{item.example}</strong>
            <p>{item.text}</p>
          </article>
        ))}
      </section>

      <section className="complexity-split">
        <article className="panel">
          <p className="eyebrow">Time complexity</p>
          <h2>How many steps does it take?</h2>
          <p>
            Time complexity counts how the number of operations changes as input grows. A loop over all items is usually
            O(n). A nested loop over the same list is often O(n^2).
          </p>
          <pre>{`for (let i = 0; i < n; i++) {
  console.log(i)
}

// Time: O(n)`}</pre>
        </article>

        <article className="panel">
          <p className="eyebrow">Space complexity</p>
          <h2>How much memory does it need?</h2>
          <p>
            Space complexity counts extra memory. Creating a new array from n items uses O(n) space. Reusing a few
            variables while looping usually uses O(1) space.
          </p>
          <pre>{`const copy = [...items]

// Space: O(n)`}</pre>
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
          {growthRates.map(([notation, name, example]) => (
            <div className="growth-row" key={notation}>
              <strong>{notation}</strong>
              <span>{name}</span>
              <p>{example}</p>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
