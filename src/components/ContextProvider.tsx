import { ReactNode, useEffect, useState } from "react";
import { UserContext, User } from "./Context.ts";

function UserContextProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/auth`, {
            method: `GET`,
            headers: {
                "Content-Type": `application/json`,
            },
            credentials: "include",
        })
            .then((resp) => {
                if (!resp.ok)
                    throw new Error(`Failed to fetch user: ${resp.status}`);
                return resp.json();
            })
            .then((data) => {
                setUser(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserContextProvider;
