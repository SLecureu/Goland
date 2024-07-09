import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ErrorPage, Layout } from "../Imports";
import { PostType } from "../components/Context";

import "./Category.scss";

import Loader from "../components/Loader";
import Post from "../components/Post";

function Category() {
    const { id } = useParams();
    const [posts, setPosts] = useState<PostType[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetch(`/api/category/${id}`)
            .then((resp) => {
                if (!resp.ok) return [];
                return resp.json();
            })
            .then(setPosts)
            .then(() => setLoading(false));
    }, [id]);

    if (loading) return <Loader />;
    if (posts.length == 0) return <ErrorPage code={404} />;
    return (
        <Layout>
            <main>
                {posts.map((post, index) => (
                    <Post post={post} key={index} />
                ))}
            </main>
        </Layout>
    );
}

export default Category;
