import "./Home.scss";

export default () => {
  const block1 = () => <>Block 1</>;
  const block2 = () => <>Block 2</>;
  const block3 = () => <>Block 3</>;
  const blocks = [block1, block2, block3];

  return (
    <main className="home_container">
      {blocks.map((b, i) => (
        <div key={i} className={`block${i}`}>
          <div className="inside_block">{b()}</div>
        </div>
      ))}
    </main>
  );
};
