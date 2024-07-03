import { useContext } from "react";

import { UserContext } from "./Context.tsx";
import { Link } from "react-router-dom";

import "./Header.scss";

export default () => {
  const { user } = useContext(UserContext);

  return (
    <header>
      <Link to="/">
        <h1>GOLAND</h1>
      </Link>
      <div className="user-box">
        {user ? (
          <span>Welcome {user.firstName}!</span>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </header>
  );
};
