import { Link } from "react-router-dom";
import { PostType } from "./Context";

export default function Post({ post }: { post: PostType }) {
    return (
        <div className="post">
            <h2>
                <Link to={`/user/${post.userID}`}>{post.username}</Link>
            </h2>
            <p>
                <Link to={`/post/${post.id}`}>{post.content}</Link>
            </p>
        </div>
    );
}
