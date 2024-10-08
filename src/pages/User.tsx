import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { User } from "../components/Context";
import { ErrorPage } from "../Imports";
import Loader from "../components/Loader";

function UserPage() {
    const { id } = useParams();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        id &&
            fetch(`/api/user/${id}`, {
                method: `GET`,
                headers: {
                    "Content-Type": `application/json`,
                },
                credentials: "include",
            })
                .then((resp) => (resp.ok ? resp.json() : null))
                .then(setUser)
                .then(() => setLoading(false))
                .catch(console.log);
    }, [id]);

    if (loading)
        return (
            <main className="loading">
                <Loader width="150px" />
            </main>
        );

    if (!user) return <ErrorPage code={404} />;

    return (
        <main>
            <h2>{user.name}</h2>
        </main>
    );
}

export default UserPage;
