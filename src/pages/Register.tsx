import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../components/Context.ts";
import "./Forms.scss";
import { SubmitHandler, useForm } from "react-hook-form";

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    gender: string;
    dateOfBirth: string;
    firstName: string;
    lastName: string;
};

function Register() {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<RegisterForm>();
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    const onSubmit: SubmitHandler<RegisterForm> = (data) =>
        fetch("/api/register", {
            credentials: "include",
            method: "POST",
            body: JSON.stringify(data),
        })
            .then(async (resp) => {
                if (!resp.ok)
                    return setError("root", {
                        type: "servr",
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
                <h2>Register</h2>
                <div className="form-error">{errors.root?.message}</div>
                <input
                    type="text"
                    placeholder="username"
                    {...register("name")}
                />
                <input
                    type="email"
                    placeholder="email"
                    {...register("email")}
                />
                <input
                    type="password"
                    placeholder="password"
                    {...register("password")}
                />
                <select {...register("gender")}>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                </select>
                <input
                    type="date"
                    placeholder="age"
                    {...register("dateOfBirth")}
                />
                <input
                    type="text"
                    placeholder="first name"
                    {...register("firstName")}
                />
                <input
                    type="text"
                    placeholder="last name"
                    {...register("lastName")}
                />
                <button type="submit">Register</button>
                <span>Already have an account ?</span>
                <Link to="/login">Login</Link>
            </form>
        </main>
    );
}

export default Register;
