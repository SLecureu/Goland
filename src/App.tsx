// Node libraries
import { Route, Routes, Navigate } from "react-router-dom";

import {
  Register,
  Login,
  Home,
  PublishPost,
  User,
  Overview,
  GetPost,
} from "./Imports.ts";

import { Protected, Error } from "./Imports.ts";

// CSS
import "./App.css";

import UserContextProvider from "./components/ContextProvider.tsx";

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/user/">
          <Route path=":id" element={<User />} />
          <Route path="" element={<Navigate to="/*" />} />
        </Route>
        <Route path="/post/">
          <Route path=":id" element={<GetPost />} />
          <Route path="" element={<PublishPost />} />
        </Route>
        <Route
          path="overview"
          element={<Protected children={<Overview />} />}
        />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Error errorCode={404} />} />
      </Routes>
    </UserContextProvider>
  );
}

export default App;
