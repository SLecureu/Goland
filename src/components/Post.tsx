import { Link } from "react-router-dom";
import { PostType } from "./Context";
import "./Post.scss";

export default function Post({ post }: { post: PostType }) {
    return (
        <a className="post_" href={`/post/${post.id}`}>
            <h2>
                <Link to={`/user/${post.userID}`}>{post.username}</Link>
            </h2>
            {post.content && (
                <Link to={`/post/${post.id}`}>
                    <p>{post.content}</p>
                </Link>
            )}
        </a>
    );
}
