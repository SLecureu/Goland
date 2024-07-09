import "./Home.scss";
import { Link } from "react-router-dom";

import { Icons } from "../Imports";
import { PostType } from "../components/Context";
import { useEffect, useState } from "react";

import Layout from "../components/Layout";
import Post from "../components/Post";

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
        <Layout>
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
                <div className="block-1 posts">
                    {posts.map((post, index) => (
                        <Post post={post} key={index} />
                    ))}
                </div>
                <div className="block-2 ">Foo</div>
            </main>
        </Layout>
    );
}
