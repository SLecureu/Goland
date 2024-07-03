import { useContext } from "react";

import { UserContext } from "./Context.tsx";
import { Link } from "react-router-dom";

import "./Header.scss";

export default () => {
  const { user } = useContext(UserContext);
  const links = {
    dst1: "login",
    dst2: "register",
  };

  user && (links.dst1 = links.dst2 = `/overview`);

  return (
    <header>
      <h1>
        <Link to="/">GOLAND</Link>
      </h1>
      <div className="user-box">
        <Link to={links.dst1}>
          {user ? <img src="/assets/vite.svg" alt="deez nuts" /> : "Login"}
        </Link>
        <Link to={links.dst2}>{user ? user.name : "Register"}</Link>
      </div>
    </header>
  );
};
