import { useContext } from "react";

import { UserContext } from "./Context.tsx";

import "./Header.css";

function Header() {
  const { user } = useContext(UserContext);

  return (
    <header>
      <h1>GOLAND</h1>
      <div>{user ? user.firstName : `login`}</div>
    </header>
  );
}

export { Header };
