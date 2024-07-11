import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import ErrorPage from "./Error";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PostType } from "../components/Context";
import { Protected } from "../Imports";

import "./PostPage.scss";

type Inputs = {
    content: string;
    categories: string[];
};
const HashTagRexExp = /(?<=#)[\w\d]+/g;

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
    const [post, setPost] = useState<PostType | null>();

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

    const [classes, setClasses] = useState([true, false, false]);
    const fields = ["Post", "Comments", "Datas"];

    const handleClick = (i: number) => () => {
        const next = [false, false, false];
        next[i] = true;
        setClasses(next);
    };

    return (
        <main className="postpage">
            <div className="banner">
                <nav>
                    <ul>
                        {fields.map((content, index) => (
                            <li onClick={handleClick(index)}>{content}</li>
                        ))}
                    </ul>
                </nav>
            </div>
            {fields.map((content, index) => (
                <div className={classes[index] ? "chosen-page" : "hide"}>
                    {content}
                </div>
            ))}
        </main>
    );
}
