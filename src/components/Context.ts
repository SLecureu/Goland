import { createContext } from "react";

export type User = {
    id: number;
    email: string;
    name: string;
    gender: "male" | "female" | "other";
    age: number;
    firstName: string;
    lastName: string;
    created: Date;
};

export type PostType = {
    id: string;
    userID: string;
    username: string;
    categories: string[];
    content: string;
    created: string;
};

type InitialType = {
    user: User | null;
    setUser: (newUser: User | null) => void;
    loading: boolean;
};

const initialValue = {
    user: null,
    setUser: console.log,
    loading: true,
};

export const UserContext = createContext<InitialType>(initialValue);
