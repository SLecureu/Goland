import Login from "./pages/Login";
import Header from "./components/Header";
import Register from "./pages/Register";
import Home from "./pages/Home";
import { GetPost, PublishPost } from "./pages/Post";
import Footer from "./components/Footer";
import Protected from "./components/Protected";

import User from "./pages/User";
import Overview from "./pages/Overview";

import home from "./assets/icons/home.svg";
import post from "./assets/icons/post.svg";
import github from "./assets/icons/github.svg";
import linkedin from "./assets/icons/linkedin.svg";
import react from "./assets/icons/react.svg";

const Icons = {
  home,
  github,
  react,
  post,
  linkedin,
};

export {
  Header,
  Login,
  Register,
  Home,
  GetPost,
  Footer,
  User,
  Overview,
  Protected,
  PublishPost,
  Icons,
};
