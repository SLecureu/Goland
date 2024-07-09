import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import ErrorPage from "./Error";
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
    const [post, setPost] = useState<Post | null>(null);

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
    }, []);

    if (!post) return <ErrorPage code={404} />;

    return (
        <Layout>
            <main>
                <h2>{post.content}</h2>
            </main>
        </Layout>
    );
}
