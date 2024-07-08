import { ReactNode, useContext } from "react";
import { UserContext } from "./Context";
import { Navigate } from "react-router-dom";

function Protected({ children }: { children: ReactNode }) {
  const { user, loading } = useContext(UserContext);
  if (loading) return <div></div>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}
export default Protected;
