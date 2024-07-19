import "./Home.scss";
import { Link } from "react-router-dom";

import { Icons } from "../assets/assets";
import { PostType } from "../components/Context";
import { useEffect, useState } from "react";

import Post from "../components/Post";
import Loader from "../components/Loader";

export default function Home() {
    const [posts, setPosts] = useState<PostType[]>([
        // {
        //     id: "",
        //     userID: "",
        //     username: "shgLJHGLHFGMFgeiuGFIYG",
        //     content: "hjgvoshgfishgp<ibvpisbvpisbsbljhbfhbvl<hbvlh<b",
        //     created: "",
        //     categories: [],
        //     image: null,
        // },
        // {
        //     id: "",
        //     userID: "",
        //     username: "1234",
        //     content: "",
        //     created: "",
        //     categories: [],
        //     image: null,
        // },
    ]);

    useEffect(() => {
        fetch("/api/posts")
            .then((resp) => (resp.ok ? resp.json() : []))
            .then(setPosts);
    }, []);

    return (
        <main className="home-container">
            <div className="block" id="block-0">
                <div className="inside-block">
                    <Link to="/post">
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
                {posts.length === 0 ? (
                    <Loader width="100px" height="100px" />
                ) : (
                    <div className="posts">
                        {posts.map((post, index) => (
                            <Post key={index} post={post} />
                        ))}
                    </div>
                )}
            </div>
            <div className="block" id="block-2"></div>
        </main>
    );
}
