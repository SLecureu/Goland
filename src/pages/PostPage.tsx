import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import ErrorPage from "./Error";
import { useEffect, useState, ChangeEvent } from "react";
import { useParams, Link } from "react-router-dom";
import { PostType } from "../components/Context";
import { Protected } from "../Imports";

import "./PostPage.scss";

type Inputs = {
    content: string;
    categories: string[];
    images: FileList;
};
const HashTagRexExp = /(?<=#)[\w\d]+/g;

export function PostPage() {
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm<Inputs>();

    const onChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        event.target.style.height = "auto";
        event.target.style.height = `${event.target.scrollHeight + 5}px`;
    };

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        data.categories = data.content.match(HashTagRexExp) || [];
        const formData = new FormData();
        formData.append(
            "json",
            JSON.stringify({
                content: data.content,
                categories: data.categories,
            })
        );

        if (data.images.length !== 0)
            formData.append("image", data.images[0], data.images[0].name);

        fetch("/api/post", {
            credentials: "include",
            method: "POST",
            body: formData,
        }).then((resp) => {
            if (!resp.ok) return;
            navigate("/");
        });
    };

    return (
        <Protected>
            <form className="posting-form" onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="content">Post Content</label>
                <textarea
                    id="content"
                    placeholder="Write your post here..."
                    {...register("content", { onChange })}
                />
                <input
                    type="file"
                    {...register("images")}
                    accept="image/*, .png, .jpg, .gif"
                />
                <button className="submit-button" type="submit">
                    Post
                </button>
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
                        {["Post", "Response", "Other"].map((t, i) => (
                            <li onClick={handleClick(i)}>
                                {t}
                                <div
                                    className={classes[i] ? "selected-li" : ""}
                                ></div>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
            {classes[0] ? (
                <>
                    <p className="headband">
                        <span>
                            By
                            <Link to={`/user/${post.userID}`}>
                                {` ${post.username} | `}
                            </Link>
                            {new Date(post.created).toLocaleDateString(
                                "en-US",
                                {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                }
                            )}
                            {post.categories[0] && ` | ${post.categories}`}
                        </span>
                    </p>
                    <div className="post-container">
                        <div className="post-content">
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPGxgS7ZNnoNjQl1JAhicq2ZAWCGx_rQ6cUw&s" />
                            <p>{post.content}</p>
                        </div>
                    </div>
                </>
            ) : classes[1] ? (
                <div>response</div>
            ) : (
                <div> other post from the same categories / user</div>
            )}
        </main>
    );
}
