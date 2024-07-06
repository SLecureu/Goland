import { Route, Routes } from "react-router-dom";

import {
    Register,
    Login,
    Home,
    Post,
    User,
    Overview,
    Protected,
} from "./Imports.ts";

// CSS
import "./App.css";

import UserContextProvider from "./components/ContextProvider.tsx";
import _404 from "./pages/404.tsx";

function App() {
    return (
        <UserContextProvider>
            <Routes>
                <Route path="/user/">
                    <Route path=":id" element={<User />} />
                    <Route path="" element={<p>Not found</p>} />
                </Route>
                <Route
                    path="overview"
                    element={<Protected child={<Overview />} />}
                />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="post" element={<Protected child={<Post />} />} />
                <Route path="/" element={<Home />} />
                <Route path="*" element={<_404 />} />
            </Routes>
        </UserContextProvider>
    );
}

export default App;
