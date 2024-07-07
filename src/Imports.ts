import Protected from "./components/Protected";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Post from "./pages/Post";
import _404 from "./pages/404";
import User from "./pages/User";
import Overview from "./pages/Overview";

import home from "./assets/icons/home.svg";
import post from "./assets/icons/post.svg";
import github from "./assets/icons/github.svg";
import linkedin from "./assets/icons/linkedin.svg";
import logo from "./assets/icons/logo.svg";
import logout from "./assets/icons/logout.svg";

export type WrapProps = {
    wrap: boolean;
};

const Icons = {
    home,
    github,
    logo,
    post,
    linkedin,
    logout,
};

export { Login, Register, Home, Post, User, Overview, Protected, Icons };
