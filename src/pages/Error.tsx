import "./Error.scss";

const ErrorPage = ({ code }: { code: number }) => {
    const messages: { [k: number]: string } = {
        401: "You are unauthorized to access this ressource.",
        404: "Not found.",
    };
    return (
        <main className="error">
            <div className="error-container">
                <h2>{code}</h2>
                <p>{messages[code]}</p>
            </div>
        </main>
    );
};

export default ErrorPage;
