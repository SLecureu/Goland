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
      <div className="block-0">
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
        {posts.length === 0 ? (
          <Loader /> // JUMPSCARE AT BEST because set timeout IS NOT a time.sleep
        ) : (
          posts.map((post, index) => {
            setTimeout(() => {}, 1000); // set timeout useless because js DOESNT WORK LIKE THAT
            return <Post post={post} key={index} />;
          })
        )}
      </div>
      <div className="block-2 ">Foo</div>
    </main>
  );
}
