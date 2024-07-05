import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { User } from "../components/Context";

function UserPage() {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch(`/api/user/${id}`, {
      method: `GET`,
      headers: {
        "Content-Type": `application/json`,
      },
      credentials: "include",
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error(`Failed to fetch user: ${resp.status}`);
        }
        return resp.json();
      })
      .then(setUser)
      .catch(console.log);
  }, []);
  return (
    <main>
      <h2>{user?.name}</h2>
    </main>
  );
}

export default UserPage;
