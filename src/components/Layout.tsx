import { ReactNode, useContext } from "react";
import { UserContext } from "./Context";
import { Link, useNavigate } from "react-router-dom";
import { Icons } from "../Imports";
import "./Layout.scss";

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

function Footer() {
    return (
        <footer>
            <div className="container">
                <section className="text">
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Sunt distinctio earum repellat quaerat voluptatibus
                        placeat nam, commodi optio pariatur est quia magnam eum
                        harum corrupti dicta, aliquam sequi voluptate quas.
                    </p>
                </section>

                <section className="icons">
                    <div>
                        <a href="https://github.com/cramanan">
                            <img
                                src={Icons.github}
                                alt="github logo"
                                title="Cramanan"
                            />
                        </a>
                        <a href="https://www.linkedin.com/in/cyril-ramananjaona-837555304/">
                            <img
                                src={Icons.linkedin}
                                alt="linkedin logo"
                                title="Cramanan"
                            />
                        </a>
                    </div>
                    <div>
                        <a href="https://github.com/SLecureu">
                            <img
                                src={Icons.github}
                                alt="github logo"
                                title="SLecureu"
                            />
                        </a>
                        <a>
                            <img
                                src={Icons.linkedin}
                                alt="linkedin logo"
                                title="SLecureu"
                            />
                        </a>
                    </div>
                </section>
            </div>

            <div className="copyright">
                © 2024 Copyright: SLecureu & Cramanan
            </div>
        </footer>
    );
}

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <div>
            <Header />
            {children}
            <Footer />
        </div>
    );
};

export default Layout;
