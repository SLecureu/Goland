import "./Home.scss";
import { Link } from "react-router-dom";

import { Icons } from "../Imports";
import { Post } from "../components/Context";
import { useEffect, useState } from "react";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  // for (let index = 0; index < 10; index++) {
  //     posts.push({
  //         id: "Foo",
  //         userID: "Bar",
  //         username: "John Doe",
  //         categories: [],
  //         content: "Baz",
  //         created: new Date().toString(),
  //     });
  // }

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
          <div key={index} className="post">
            <h2>
              <Link to={`/user/${post.userID}`}>{post.username}</Link>
            </h2>
            <p>{post.content}</p>
          </div>
        ))}
      </div>
      <div className="block-2 ">Foo</div>
    </main>
  );
}
