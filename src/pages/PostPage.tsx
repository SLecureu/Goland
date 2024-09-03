import { SubmitHandler, useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import ErrorPage from "./Error";
import { useEffect, useState, ChangeEvent, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { PostType, UserContext } from "../components/Context";

import "./PostPage.scss";
import Loader from "../components/Loader";

type Inputs = {
    content: string;
    images: FileList;
};

const HashTagRexExp = /(?<=#)[\w\d]+/g;

export function PostPage() {
    const { user, loading } = useContext(UserContext);
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm<Inputs>();

    if (loading)
        return (
            <main className="loading">
                <Loader width="150px" />
            </main>
        );

    if (!user) return <Navigate to="/login" replace />;

    const onChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        event.target.style.height = "auto";
        event.target.style.height = `${event.target.scrollHeight + 5}px`;
    };

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        const categories =
            Array.from(new Set(data.content.match(HashTagRexExp))) || [];

        const formData = new FormData();
        formData.append(
            "json",
            JSON.stringify({
                content: data.content,
                categories,
            })
        );

        if (data.images.length !== 0)
            formData.append("image", data.images[0], data.images[0].name);

        fetch("/api/post", {
            credentials: "include",
            method: "POST",
            body: formData,
        }).then((resp) => resp.ok && navigate("/"));
    };

    return (
        <main>
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
        </main>
    );
}

type CommentType = {
    id: string;
    userid: string;
    postid: string;
    username: string;
    content: string;
    created: string;
};

type CommentForm = {
    content: string;
};

export function GetPost() {
    const { id } = useParams();

    if (!id) return <ErrorPage code={404} />;

    const { user } = useContext(UserContext);
    const [post, setPost] = useState<PostType | null>(null);
    const [windows, setWindows] = useState([true, false, false]);
    const handleClick = (i: number) => () => {
        const next = [false, false, false];
        next[i] = true;
        setWindows(next);
    };

    const [comments, setComments] = useState<CommentType[]>([]);
    const { register, handleSubmit, resetField } = useForm<CommentForm>();

    const onSubmit: SubmitHandler<CommentForm> = async (data) =>
        user &&
        fetch(`/api/post/${id}/comment`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        }).then((resp) => {
            if (resp.ok) {
                resetField("content");
                setComments([
                    ...comments,
                    {
                        id: "",
                        userid: user.id,
                        postid: id,
                        username: user.name,
                        content: data.content,
                        created: new Date().toString(),
                    },
                ]);
            }
        });

    useEffect(() => {
        fetch(`/api/post/${id}`, {
            method: `GET`,
            headers: {
                "Content-Type": `application/json`,
            },
            credentials: "include",
        })
            .then((resp) => (resp.ok ? resp.json() : null))
            .then(setPost)
            .catch(console.error);

        fetch(`/api/post/${id}/comments`)
            .then((resp) => (resp.ok ? resp.json() : []))
            .then(setComments);
    }, [id]);

    const onChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        event.target.style.height = "auto";
        event.target.style.height = `${event.target.scrollHeight + 5}px`;
    };

    if (!post) return <ErrorPage code={404} />;

    return (
        <main className="postpage">
            <div className="banner">
                <nav>
                    <ul>
                        {["Post", "Comments", "Other"].map((title, i) => (
                            <li onClick={handleClick(i)}>
                                <span>{title}</span>
                                <div
                                    className={windows[i] ? "selected-li" : ""}
                                ></div>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
            {windows[0] ? (
                <>
                    <div className="headband">
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
                            {post.categories.length !== 0 ? " | " : ""}
                            {post.categories.join(" | ")}
                        </span>
                    </div>
                    <div className="post-container">
                        <div className="post-content">
                            {post.image && <img src={post.image} />}
                            <p>{post.content}</p>
                        </div>
                    </div>
                </>
            ) : windows[1] ? (
                <>
                    <div className="comments-container">
                        <form
                            className="posting-form"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <textarea
                                id="content"
                                placeholder="Write your comment here..."
                                {...register("content", { onChange })}
                                disabled={!user}
                            />
                            <button className="submit-button" type="submit">
                                Post
                            </button>
                        </form>

                        {comments.map((comment) => (
                            <div className="comment-content">
                                <span className="username">
                                    <Link to={`/user/${comment.userid}`}>
                                        {comment.username}
                                    </Link>
                                </span>
                                <span className="date">
                                    {" "}
                                    /
                                    {new Date(
                                        comment.created
                                    ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                    /{" "}
                                </span>
                                <p>{comment.content}</p>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div> other post from the same categories / user</div>
            )}
        </main>
    );
}
