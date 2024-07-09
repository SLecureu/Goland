import Layout from "../components/Layout";
import "./Error.scss";

const ErrorPage = ({ errorCode }: { errorCode: number }) => {
  let errorMsg = "";
  switch (errorCode) {
    case 404:
      errorMsg = "Not found";
      break;
    default:
  }
  return (
    <Layout>
      <div className="error-container">
        <span>{errorCode}:</span>
        <p>{errorMsg}</p>
      </div>
    </Layout>
  );
};

export default ErrorPage;
