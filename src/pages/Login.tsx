import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import { UserContext } from "../components/Context.ts";
import { SubmitHandler, useForm } from "react-hook-form";

import "./Forms.scss";

type LoginForm = {
    email: string;
    password: string;
};

function Login() {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<LoginForm>();
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    const onSubmit: SubmitHandler<LoginForm> = (data) =>
        fetch("/api/login", {
            credentials: "include",
            method: "POST",
            body: JSON.stringify(data),
        })
            .then(async (resp) => {
                if (!resp.ok)
                    return setError("root", {
                        type: "server",
                        message: (await resp.json()).message,
                    });
                navigate("/");
                return setUser(await resp.json());
            })
            .catch(() =>
                setError("root", {
                    type: "server",
                    message:
                        "Sorry, we were unable to log you in. Try again later.",
                })
            );

    return (
        <main className="form-page">
            <form onSubmit={handleSubmit(onSubmit)}>
                <h2>Login</h2>
                <div className="form-error">{errors.root?.message}</div>
                <label htmlFor="email">E-mail: </label>
                <input
                    type="email"
                    placeholder="email"
                    {...register("email")}
                />
                <label htmlFor="password">Password: </label>
                <input
                    type="password"
                    placeholder="password"
                    {...register("password")}
                />
                <button type="submit">Login</button>
                or
                <Link to="/register">Register</Link>
            </form>
        </main>
    );
}

export default Login;
