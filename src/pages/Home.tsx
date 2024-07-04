import "./Home.scss";
import { Icons } from "../Imports";

export default function Home() {
    return (
        <main className="home-container">
            <div className="block-1">
                <div className="inside-block">
                    <img
                        src={Icons.home}
                        alt="Home Icon"
                        className="icons"
                        width="50px"
                    />
                </div>
            </div>
            <div className="block-1">
                <div className="inside-block"></div>
            </div>
            <div className="block-1">
                <div className="inside-block"></div>
            </div>
        </main>
    );
}
