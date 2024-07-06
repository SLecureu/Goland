import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

type Inputs = {
    content: string;
    categories: string[];
};

export default function Post() {
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm<Inputs>();
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        if (!data.content) return;
        data.categories = data.content.match(/#([a-zA-Z\d-]+)/g) || [];
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
        <Layout>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="content">Post Content</label>
                <textarea id="content" {...register("content")} />
                <button type="submit">Post</button>
            </form>
        </Layout>
    );
}
