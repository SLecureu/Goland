import { useContext } from "react";
import { UserContext } from "../components/Context";
import ErrorPage from "./Error";

function Overview() {
    const { user } = useContext(UserContext);
    if (!user) return <ErrorPage code={401} />;
    return (
        <main>
            <h1>Overview</h1>
            <h2>{user.name}</h2>
        </main>
    );
}

export default Overview;
