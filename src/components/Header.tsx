import { useContext } from "react";

import { UserContext } from "./Context.ts";
import { Link } from "react-router-dom";

import { Icons } from "../Imports.ts";

import "./Header.scss";

function Header() {
    const { user } = useContext(UserContext);
    const links = {
        dst1: "login",
        dst2: "register",
    };

    user && (links.dst1 = `/overview`);

    return (
        <header>
            <h1>
                <Link to="/" className="logo">
                    <span>G</span>
                    <img src={Icons.react} width="44px" />
                    <span>LAND</span>
                </Link>
            </h1>
            <div className="user-box">
                <Link to={links.dst1}>{user ? user.firstName : "Login"}</Link>
                <Link to={links.dst2}>{user ? "logout" : "Register"}</Link>
            </div>
        </header>
    );
}

export default Header;
