export function InfoBlock({ title, value, text }) {
  return (
    <article className="info-block">
      <p>{value}</p>
      <h2>{title}</h2>
      <span>{text}</span>
    </article>
  );
}
