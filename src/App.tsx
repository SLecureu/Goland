import { Route, Routes } from "react-router-dom";

import {
    Header,
    Register,
    Login,
    Home,
    Post,
    Footer,
    User,
    Overview,
    Protected,
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
                <Route path="*" element={<p>Not found</p>} />
            </Routes>
            <Footer />
        </UserContextProvider>
    );
}

export default App;
