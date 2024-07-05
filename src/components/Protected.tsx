import { ReactNode, useContext } from "react";
import { UserContext } from "./Context";
import { Navigate } from "react-router-dom";

function Protected({ child }: { child: ReactNode }) {
    const { user, loading } = useContext(UserContext);
    if (loading) return <div></div>;
    if (!user) return <Navigate to="/login" replace />;

    return child;
}
export default Protected;
