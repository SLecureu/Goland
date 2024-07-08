// Node libraries
import { Route, Routes, Navigate } from "react-router-dom";

import {
  Header,
  Register,
  Login,
  Home,
  PublishPost,
  Footer,
  User,
  Overview,
  GetPost,
} from "./Imports.ts";

// CSS
import "./App.css";

import UserContextProvider from "./components/ContextProvider.tsx";

function App() {
  return (
    <UserContextProvider>
      <Header />
      <Routes>
        <Route path="/user/">
          <Route path=":id" element={<User />} />
          <Route path="" element={<Navigate to="/*" />} />
        </Route>
        <Route path="/post/">
          <Route path=":id" element={<GetPost />} />
          <Route path="" element={<PublishPost />} />
        </Route>
        <Route path="overview" element={<Overview />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="*" element={<p>Not found</p>} />
      </Routes>
      <Footer />
    </UserContextProvider>
  );
}

export default App;
