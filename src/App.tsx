// Node libraries
import { Route, Routes } from "react-router-dom";
import { UserContextProvider } from "./components/Context.tsx";

// Components / Pages
import Login from "./pages/Login.tsx";
import Header from "./components/Header.tsx";
import Register from "./pages/Register.tsx";
import Home from "./pages/Home.tsx";

// CSS
import "./App.css";
import User from "./pages/User.tsx";

function App() {
  return (
    <UserContextProvider>
      <Header />
      <Routes>
        <Route path="/user/">
          <Route path=":id" element={<User />} />
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="*" element={<p>Not found</p>} />
      </Routes>
    </UserContextProvider>
  );
}

export default App;
