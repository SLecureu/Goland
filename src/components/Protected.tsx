import { ReactNode, useContext } from "react";
import { UserContext } from "./Context";
import { Navigate } from "react-router-dom";
import Loader from "./Loader";

function Protected({ children }: { children: ReactNode }) {
    const { user, loading } = useContext(UserContext);
    if (loading) children = <Loader width="100px" />;
    else if (!user) children = <Navigate to="/login" replace />;
    return <main>{children}</main>;
}
export default Protected;
