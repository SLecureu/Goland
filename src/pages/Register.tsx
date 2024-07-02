import { FormEvent, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../components/Context";

function Register() {
  const [error, seterror] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const HandleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(
        Object.fromEntries(new FormData(e.target as HTMLFormElement).entries())
      ),
    }).then(async (resp) => {
      const data = await resp.json();
      if (!resp.ok) seterror(data.message);
      else {
        setUser(data);
        navigate("/");
      }
    });
  };

  return (
    <form onSubmit={HandleSubmit}>
      {error && <p>{error}</p>}
      <input name="name" type="text" placeholder="username" />
      <input name="email" type="email" placeholder="email" />
      <input name="password" type="password" placeholder="password" />
      <select name="gender">
        <option value="M">M</option>
        <option value="F">F</option>
        <option value="other">Other</option>
      </select>
      <input name="dateOfBirth" type="date" placeholder="age" />
      <input name="firstName" type="text" placeholder="first name" />
      <input name="lastName" type="text" placeholder="last name" />
      <button type="submit">Register</button>
    </form>
  );
}

export { Register };
