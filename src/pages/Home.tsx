import "./Home.scss";
import { Link } from "react-router-dom";

import { Icons } from "../assets/assets";
import { PostType } from "../components/Context";
import { useEffect, useState } from "react";

import Post from "../components/Post";
import Loader from "../components/Loader";

export default function Home() {
    const [posts, setPosts] = useState<PostType[]>([]);

    useEffect(() => {
        fetch("/api/posts")
            .then((resp) => {
                if (resp.ok) return resp.json();
                return [];
            })
            .then(setPosts);
    }, []);

    return (
        <main className="home-container">
            <div className="block" id="block-0">
                <div className="inside-block">
                    <Link
                        to="/post"
                        style={{ display: "flex", alignItems: "center" }}
                    >
                        <img
                            src={Icons.post}
                            alt="Post Icon"
                            className="icons"
                            width="50px"
                        />
                        <span>Create a Post</span>
                    </Link>
                </div>
            </div>
            <div className="block" id="block-1">
                <div className="posts">
                    {posts.length === 0 ? (
                        <Loader width="100px" height="100px" />
                    ) : (
                        posts.map((post, index) => {
                            return <Post key={index} post={post} />;
                        })
                    )}
                </div>
            </div>
            <div className="block" id="block-2">
                <div id="searchbars">
                    <input type="text" />
                </div>
            </div>
        </main>
    );
}
