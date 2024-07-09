import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { User } from "../components/Context";
import { Layout } from "../Imports";

function UserPage() {
    const { id } = useParams();
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

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
                    navigate("/*");
                    return null;
                }
                return resp.json();
            })
            .then(setUser)
            .catch(console.log);
    }, []);

    if (!user)
        return (
            <Layout>
                <div>Loading</div>
            </Layout>
        );

    return (
        <Layout>
            <main>
                <h2>{user.name}</h2>
            </main>
        </Layout>
    );
}

export default UserPage;
