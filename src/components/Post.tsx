import { Link } from "react-router-dom";
import { PostType } from "./Context";

export default function Post({ post }: { post: PostType }) {
    return (
        <a className="post" href={`/post/${post.id}`}>
            <h2>
                <Link to={`/user/${post.userID}`}>{post.username}</Link>
            </h2>
            {post.content && (
                <p>
                    <Link to={`/post/${post.id}`}>{post.content}</Link>
                </p>
            )}
        </a>
    );
}
