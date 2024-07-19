import { useContext } from "react";
import { UserContext } from "../components/Context";
import "./Overview.scss";
import { Navigate } from "react-router-dom";
import Loader from "../components/Loader";

function Overview() {
    const { user, loading } = useContext(UserContext);
    if (loading)
        return (
            <main className="loading">
                <Loader width="150px" />
            </main>
        );

    if (!user) return <Navigate to="/login" replace />;
    return (
        <main className="overview">
            <h1 className="title">Overview</h1>
            <div className="stats">
                <h2>{user.name}</h2>
            </div>
        </main>
    );
}

export default Overview;
