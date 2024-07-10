import "./Error.scss";

const ErrorPage = ({ code }: { code: number }) => {
  let msg = "";
  switch (code) {
    case 404:
      msg = "Not Found";
      break;

    default:
      break;
  }
  return (
    <div className="error-container">
      <h2>{code}</h2>
      <p>{msg}</p>
    </div>
  );
};

export default ErrorPage;
