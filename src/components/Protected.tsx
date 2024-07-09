import { ReactNode, useContext } from "react";
import { UserContext } from "./Context";
import { Navigate } from "react-router-dom";
import Loader from "./Loader";

function Protected({ children }: { children: ReactNode }) {
    const { user, loading } = useContext(UserContext);
    if (loading) return <Loader />;
    if (!user) return <Navigate to="/login" replace />;

    return children;
}
export default Protected;
