import { SubmitHandler, useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Post } from "../components/Context";
import { Protected } from "../Imports";
import { Layout } from "../Imports";

type Inputs = {
  content: string;
  categories: string[];
};

export function PublishPost() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!data.content) return;
    data.categories = data.content.match(/#([a-zA-Z\d-]+)/g) || [];
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
      <Layout>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="content">Post Content</label>
          <textarea id="content" {...register("content")} />
          <button type="submit">Post</button>
        </form>
      </Layout>
    </Protected>
  );
}

export function GetPost() {
  const { id } = useParams();
  const [publication, setPublication] = useState<Post | null>(null);

  useEffect(() => {
    fetch(`/api/post/${id}`, {
      method: `GET`,
      headers: {
        "Content-Type": `application/json`,
      },
      credentials: "include",
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error(`Failed to fetch post: ${resp.status}`);
        }
        return resp.json();
      })
      .then(setPublication)
      .catch(console.log);
  }, []);

  return publication ? (
    <main>
      <h2>{publication?.content}</h2>
    </main>
  ) : (
    <Navigate to="/*" />
  );
}
