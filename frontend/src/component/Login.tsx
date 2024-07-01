import { FormEvent, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./Context";

function Login() {
  const [error, seterror] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const HandleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch("/api/login", {
      method: "POST",
      body: JSON.stringify(
        Object.fromEntries(new FormData(e.target as HTMLFormElement).entries())
      ),
    }).then(async (resp) => {
      if (resp.ok) {
        navigate("/");
        setUser(await resp.json());
      }
      resp.json().then((data) => seterror(data.message));
    });
  };

  return (
    <form onSubmit={HandleSubmit}>
      {error && <p>{error}</p>}
      <input name="email" type="email" placeholder="email" />
      <input name="password" type="password" placeholder="password" />
      <button type="submit">Login</button>
    </form>
  );
}

export { Login };
