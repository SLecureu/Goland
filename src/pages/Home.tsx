import "./Home.scss";
import { Link } from "react-router-dom";

import { Icons } from "../Imports";

export default function Home() {
    return (
        <main className="home-container">
            <div className="block-0">
                <div className="inside-block">
                    <img
                        src={Icons.home}
                        alt="Home Icon"
                        className="icons"
                        width="50px"
                    />
                    <span>All posts</span>
                </div>
                <Link to="/post" className="inside-block">
                    <img
                        src={Icons.post}
                        alt="Home Icon"
                        className="icons"
                        width="50px"
                    />
                    <span>Create a Post</span>
                </Link>
            </div>
            <div className="block-1"></div>
            <div className="block-2 "></div>
        </main>
    );
}
