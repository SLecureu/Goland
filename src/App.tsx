// Node libraries
import { Route, Routes } from "react-router-dom";

import {
    Header,
    Register,
    Login,
    Home,
    PostPage,
    User,
    Overview,
    GetPost,
    Category,
    ErrorPage,
    Protected,
    Footer,
} from "./Imports.ts";

// CSS
import "./App.scss";

import UserContextProvider from "./components/ContextProvider.tsx";

function App() {
    return (
        <UserContextProvider>
            <Header />
            <main>
                <Routes>
                    <Route path="/user/">
                        <Route path=":id" element={<User />} />
                        <Route path="" element={<ErrorPage code={404} />} />
                    </Route>
                    <Route path="/post/">
                        <Route path=":id" element={<GetPost />} />
                        <Route path="" element={<PostPage />} />
                    </Route>
                    <Route path="/category/">
                        <Route path=":id" element={<Category />} />
                        <Route path="" element={<ErrorPage code={404} />} />
                    </Route>
                    <Route
                        path="overview"
                        element={<Protected children={<Overview />} />}
                    />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="/" element={<Home />} />
                    <Route path="*" element={<ErrorPage code={404} />} />
                </Routes>
            </main>
            <Footer />
        </UserContextProvider>
    );
}

export default App;
