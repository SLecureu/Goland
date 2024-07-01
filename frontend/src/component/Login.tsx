import { FormEvent, useState } from "react"
import { useNavigate } from "react-router-dom"

function Login() {

    const [error, seterror] = useState("")
    const navigate = useNavigate()

    const HandleSubmit = async(e:FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        fetch("/api/login", {
            method: "POST",
            body: JSON.stringify(
                Object.fromEntries(
                    new FormData(
                        e.target as HTMLFormElement
                    ).entries()
                )
            )
        })
        .then((resp) => {
            if (resp.ok) navigate("/")
            resp.json().then((data) => seterror(data.message))
        })
    }

    return (
        <form onSubmit={HandleSubmit}>
            {error && <p>{error}</p>}
            <input name="email" type="email" placeholder="email"/>
            <input name="password" type="password" placeholder="password"/>
            <button type="submit">Login</button>
        </form>
    )
}

export {Login}