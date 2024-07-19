import { createContext } from "react";

export type User = {
    id: string;
    email: string;
    name: string;
    gender: "M" | "F" | "O";
    age: number;
    firstName: string;
    lastName: string;
    created: string;
    posts: string[];
};

export type PostType = {
    id: string;
    userID: string;
    username: string;
    categories: string[];
    content: string;
    image: string | null;
    created: string;
};

type InitialType = {
    user: User | null;
    setUser: (newUser: User | null) => void;
    loading: boolean;
};

export const UserContext = createContext<InitialType>({
    user: null,
    setUser: console.log,
    loading: true,
});
