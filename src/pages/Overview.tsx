import { useContext } from "react";
import { UserContext } from "../components/Context";

export default () => {
  const { user } = useContext(UserContext);
  return (
    <main>
      <h1>Overview</h1>
      <h2>{user?.name}</h2>
    </main>
  );
};
