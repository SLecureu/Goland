import { ReactNode, useEffect, useState } from "react";
import { UserContext, User } from "./Context.ts";

function UserContextProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            fetch(`/api/auth`, {
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
                .then((data) => {
                    setUser(data);
                })
                .then(() => setLoading(false));
        } catch (reason) {
            console.log(reason);
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserContextProvider;
