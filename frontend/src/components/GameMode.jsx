export function GameMode({ icon, title, text }) {
  return (
    <article className="game-card">
      {icon}
      <h2>{title}</h2>
      <p>{text}</p>
    </article>
  );
}
