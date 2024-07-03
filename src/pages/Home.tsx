import "./Home.scss";

export default () => {
  const block1 = () => <>Block 1</>;
  const block2 = () => <>Block 2</>;
  const block3 = () => <>Block 3</>;

  return (
    <main className="home-container">
      {[block1, block2, block3].map((b, i) => (
        <div key={i} className={`block-${i}`}>
          <div className="inside-block">{b()}</div>
        </div>
      ))}
    </main>
  );
};
