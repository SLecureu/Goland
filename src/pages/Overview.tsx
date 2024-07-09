import { useContext } from "react";
import { UserContext } from "../components/Context";

function Overview() {
    const { user } = useContext(UserContext);
    return (
        <main>
            <h1>Overview</h1>
            <h2>{user?.name}</h2>
        </main>
    );
}

export default Overview;
