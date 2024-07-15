import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import ErrorPage from "./Error";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PostType } from "../components/Context";
import { Protected, FormatDate } from "../Imports";

import "./PostPage.scss";

type Inputs = {
  content: string;
  categories: string[];
};

const HashTagRexExp = /(?<=#)[\w\d\.]+/g;

export function PostPage() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!data.content) return;
    data.categories = data.content.match(HashTagRexExp) || [];
    await fetch("/api/post", {
      credentials: "include",
      method: "POST",
      body: JSON.stringify(data),
    }).then((resp) => {
      if (!resp.ok) return;
      navigate("/");
    });
  };

  return (
    <Protected>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="content">Post Content</label>
        <textarea id="content" {...register("content")} />
        <button type="submit">Post</button>
      </form>
    </Protected>
  );
}

export function GetPost() {
  const { id } = useParams();
  const [post, setPost] = useState<PostType | null>(null);
  const [classes, setClasses] = useState([true, false, false]);

  useEffect(() => {
    fetch(`/api/post/${id}`, {
      method: `GET`,
      headers: {
        "Content-Type": `application/json`,
      },
      credentials: "include",
    })
      .then((resp) => {
        if (!resp.ok) return null;
        return resp.json();
      })
      .then(setPost)
      .catch(console.log);
  }, [id]);

  if (!post) return <ErrorPage code={404} />;

  const Factorize = ({ t, i }: { t: string; i: number }) => {
    return (
      <li
        onClick={() => {
          const next = [false, false, false];
          next[i] = true;
          setClasses(next);
        }}
      >
        {t}
        <div className={classes[i] ? "selected-li" : ""}></div>
      </li>
    );
  };

  return (
    <main className="postpage">
      <div className="banner">
        <nav>
          <ul>
            {["Post", "Response", "Other"].map((t, i) => {
              return <Factorize t={t} i={i} />;
            })}
          </ul>
        </nav>
      </div>
      {classes[0] ? (
        <div>
          <p>
            By {post.username} |&nbsp;
            {FormatDate({ dateObject: new Date(post.created) })}
            {post.categories[0] ? ` | ${post.categories}` : ""}
          </p>
          <div>{post.content}</div>
        </div>
      ) : classes[1] ? (
        <div>response</div>
      ) : (
        <div> other post from the same categories / user</div>
      )}
    </main>
  );
}
