import { useContext } from "react";
import { UserContext } from "../components/Context";
import "./Overview.scss";
import { Navigate } from "react-router-dom";

function Overview() {
    const { user, loading } = useContext(UserContext);
    if (loading) return <main>Loading</main>;
    if (!user) return <Navigate to="/login" replace />;
    return (
        <main className="overview">
            <h1>Overview</h1>
            <h2>{user.name}</h2>
        </main>
    );
}

export default Overview;
