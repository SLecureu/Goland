import { Link } from "react-router-dom";
import { PostType } from "./Context";

export default function Post({ post, key }: { post: PostType; key: number }) {
    return (
        <div className="post" key={key}>
            <Link to={`/user/${post.userID}`}>
                <h2>{post.username}</h2>
            </Link>
            <p>{post.content}</p>
        </div>
    );
}
