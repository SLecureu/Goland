import { Route, Routes } from "react-router-dom";

import { Header } from "./component/Header.tsx";
import { Login } from "./component/Login.tsx";
import { UserContextProvider } from "./component/Context.tsx";

import "./App.css";

function App() {
  return (
    <UserContextProvider>
      <Header />
      <Routes>
        <Route path="/" />
        <Route path="/login" element={<Login />} />
        <Route path="/register" />
        <Route path="*" element={<p>Not found</p>} />
      </Routes>
    </UserContextProvider>
  );
}

export default App;
