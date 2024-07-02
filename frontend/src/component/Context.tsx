import React, { createContext, useEffect, useState } from "react";

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

type InitialType = {
  user: User | null;
  setUser: (newUser: User) => void;
};

const initialValue = {
  user: null,
  setUser: () => {},
};

export const UserContext = createContext<InitialType>(initialValue);

export const useFetchUser = () => {
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
        if (!resp.ok) {
          throw new Error(`Failed to fetch user: ${resp.status}`);
        }
        return resp.json();
      })
      .then(setUser)
      .catch(console.log);
  }, []);
  return { user, setUser };
};

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user, setUser } = useFetchUser();

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
