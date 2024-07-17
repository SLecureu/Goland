import { SubmitHandler, useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import ErrorPage from "./Error";
import { useEffect, useState, ChangeEvent, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { PostType, UserContext } from "../components/Context";

import "./PostPage.scss";

type Inputs = {
    content: string;
    images: FileList;
};
const HashTagRexExp = /(?<=#)[\w\d]+/g;

export function PostPage() {
    const { user, loading } = useContext(UserContext);
    if (loading) return <main>Loading...</main>;
    if (!user) return <Navigate to="/login" replace />;

    const navigate = useNavigate();
    const { register, handleSubmit } = useForm<Inputs>();

    const onChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        event.target.style.height = "auto";
        event.target.style.height = `${event.target.scrollHeight + 5}px`;
    };

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        const categories = data.content.match(HashTagRexExp) || [];
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
        }).then((resp) => {
            if (!resp.ok) return;
            navigate("/");
        });
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

export function GetPost() {
    const { id } = useParams();
    const [post, setPost] = useState<PostType | null>(null);

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
    }, [id]);

    if (!post) return <ErrorPage code={404} />;

    const [windows, setWindows] = useState([true, false, false]);
    const handleClick = (i: number) => () => {
        const next = [false, false, false];
        next[i] = true;
        setWindows(next);
    };

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
                            {post.image && <img src={post.image} />}
                            <p>{post.content}</p>
                        </div>
                    </div>
                </>
            ) : windows[1] ? (
                <div>Comments</div>
            ) : (
                <div> other post from the same categories / user</div>
            )}
        </main>
    );
}
