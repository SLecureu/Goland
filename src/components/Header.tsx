import { useContext } from "react";

import { UserContext } from "./Context.tsx";
import { Link } from "react-router-dom";

import "./Header.css";

function Header() {
  const { user } = useContext(UserContext);

  return (
    <header>
      <Link className="txt_deco_none" to="/">
        <h1>GOLAND</h1>
      </Link>
      <div>
        {user ? (
          <p>Welcome {user.firstName}!</p>
        ) : (
          <>
            <Link className="txt_deco_none" to="/login">
              Login
            </Link>
            <Link className="txt_deco_none" to="/register">
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export { Header };
