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
      <div>{user ? user.firstName : `login`}</div>
    </header>
  );
}

export { Header };
