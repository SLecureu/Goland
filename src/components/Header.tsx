import { useContext } from "react";

import { UserContext } from "./Context.ts";
import { Link, useNavigate } from "react-router-dom";

import { Icons } from "../Imports.ts";

import "./Header.scss";

function Header() {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        fetch("/api/logout", { credentials: "include" }).then((resp) => {
            if (resp.ok) navigate("/");
            setUser(null);
        });
    };

    return (
        <header>
            <h1>
                <Link to="/" className="logo">
                    <span>G</span>
                    <img src={Icons.logo} width="38px" />
                    <span>LAND</span>
                </Link>
            </h1>
            <div className="user-box">
                <Link to={user ? "overview" : "login"}>
                    {user ? user.firstName : "Login"}
                </Link>
                {user ? (
                    <img
                        className="logout"
                        src={Icons.logout}
                        alt="Logout"
                        title="Log Out"
                        onClick={handleLogout}
                    />
                ) : (
                    <Link to="register">Register</Link>
                )}
            </div>
        </header>
    );
}

export default Header;
