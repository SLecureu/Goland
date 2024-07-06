import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { UserContext } from "../components/Context.ts";
import { SubmitHandler, useForm } from "react-hook-form";

import "./Login.scss";

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
            .catch(console.error);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
            {errors.root && (
                <span className="form-error">{errors.root.message}</span>
            )}
            <input type="email" placeholder="email" {...register("email")} />
            <input
                type="password"
                placeholder="password"
                {...register("password")}
            />
            <button type="submit">Login</button>
        </form>
    );
}

export default Login;
