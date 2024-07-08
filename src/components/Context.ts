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

export type Post = {
  id: number;
  userid: number;
  content: string;
};

type InitialType = {
  user: User | null;
  setUser: (newUser: User | null) => void;
};

const initialValue = {
  user: null,
  setUser: console.log,
};

export const UserContext = createContext<InitialType>(initialValue);
