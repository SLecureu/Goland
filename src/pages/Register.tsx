import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../components/Context.ts";
import "./Forms.scss";
import { SubmitHandler, useForm } from "react-hook-form";
// import { Icons } from "../Imports.ts";

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
        <form onSubmit={handleSubmit(onSubmit)} className="register-form">
            {/* <img
                            src={Icons.logo}
                            alt="Background Logo"
                            className="spinning-background"
                        /> */}
            <span>{errors.root?.message}</span>
            <input type="text" placeholder="username" {...register("name")} />
            <input type="email" placeholder="email" {...register("email")} />
            <input
                type="password"
                placeholder="password"
                {...register("password")}
            />
            <select {...register("gender")}>
                <option value="Male">M</option>
                <option value="Female">F</option>
                <option value="Other">Other</option>
            </select>
            <input type="date" placeholder="age" {...register("dateOfBirth")} />
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
            <span>
                Already have an account ?<Link to="/login">Login</Link>
            </span>
            <button type="submit">Register</button>
        </form>
    );
}

export default Register;
