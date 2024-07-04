import { ReactNode, useEffect, useState } from "react";

import { UserContext, User } from "./Context.ts";

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

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
            .then(setUser)
            .catch(console.error);
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
