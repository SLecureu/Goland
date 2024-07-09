import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { User } from "../components/Context";
import { Layout, ErrorPage } from "../Imports";
import Loader from "../components/Loader";

function UserPage() {
    const { id } = useParams();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

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
            .then(() => setLoading(false))
            .catch(console.log);
    }, [id]);

    if (loading)
        return (
            <Layout>
                <Loader />
            </Layout>
        );
    if (!user) return <ErrorPage code={404} />;

    return (
        <Layout>
            <main>
                <h2>{user.name}</h2>
            </main>
        </Layout>
    );
}

export default UserPage;
