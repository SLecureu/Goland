import { ReactNode, useEffect, useState } from "react";
import { UserContext, User } from "./Context";

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
            .then((resp) => (resp.ok ? resp.json() : null))
            .then(setUser)
            .then(() => setLoading(false))
            .catch(console.error);

        // setUser({
        //     id: "0001",
        //     name: "John",
        //     email: "john@mail.com",
        //     gender: "M",
        //     age: 18,
        //     firstName: "John",
        //     lastName: "Doe",
        //     created: "now",
        //     posts: [],
        // });
        // setLoading(false);
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserContextProvider;
