import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ErrorPage } from "../Imports";
import { PostType } from "../components/Context";

import "./Category.scss";

import Loader from "../components/Loader";
import Post from "../components/Post";

function Category() {
    const { id } = useParams();
    const [posts, setPosts] = useState<PostType[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        id &&
            fetch(`/api/category/${id}`)
                .then((resp) => (resp.ok ? resp.json() : []))
                .then(setPosts)
                .then(() => setLoading(false));
    }, [id]);

    if (loading)
        return (
            <main>
                <Loader />
            </main>
        );

    if (posts.length == 0) return <ErrorPage code={404} />;

    return (
        <main>
            {posts.map((post, index) => (
                <Post post={post} key={index} />
            ))}
        </main>
    );
}

export default Category;
