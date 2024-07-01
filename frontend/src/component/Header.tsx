import { useEffect, useState } from "react";
import "./Header.css"
  
export type User = {
    id: number;
    email: string;
    name: string;
    gender: 'male' | 'female' | 'other';
    age: number;
    firstName: string;
    lastName: string;
    created: Date;
}

function Header() {
    const [user, setuser] = useState<User | null>(null);
    
    useEffect(() => {
        fetch(`/api/auth`, {
            method: `GET`,
            headers: {
                "Content-Type": `application/json`
            },
            credentials: "include"
        })
        .then((resp) => {
            if (!resp.ok) return null;
            return resp.json()
        })
        .then((data) => setuser(data))
        .catch(err => console.log(err))
    }, []);

    return (
        <header>
            <h1>GOLAND</h1>
            <div>
                {user? user.firstName
                : `login`}
            </div>
        </header>
    )
}

export {Header}