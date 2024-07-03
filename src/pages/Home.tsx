import "./Home.scss";

export default () => {
  const block1 = () => <>test</>;
  const block2 = () => <>Mes couilles</>;
  const block3 = () => <>test</>;
  const blocks = [block1, block2, block3];

  return (
    <main className="home_container">
      {blocks.map((b, i) => (
        <div className={`block${i}`}>
          <div className="inside_block">{b()}</div>
        </div>
      ))}
    </main>
  );
};
