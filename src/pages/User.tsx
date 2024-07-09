import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { User } from "../components/Context";
import { Layout, ErrorPage } from "../Imports";

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
        if (!resp.ok) return null;
        return resp.json();
      })
      .then(setUser)
      .catch(console.log);
  }, []);

  if (!user) return <ErrorPage errorCode={404} />;

  return (
    <Layout>
      <main>
        <h2>{user.name}</h2>
      </main>
    </Layout>
  );
}

export default UserPage;
