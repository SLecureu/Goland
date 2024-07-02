import { Route, Routes } from "react-router-dom";

import { Login } from "./pages/Login.tsx";
import { UserContextProvider } from "./components/Context.tsx";

import "./App.css";
import { Header } from "./components/Header.tsx";
import { Register } from "./pages/Register.tsx";

function App() {
  return (
    <UserContextProvider>
      <Header />
      <Routes>
        <Route path="/" />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<p>Not found</p>} />
      </Routes>
    </UserContextProvider>
  );
}

export default App;
