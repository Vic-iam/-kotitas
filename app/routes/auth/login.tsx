import type { Route } from "./+types/login";


export function meta({ }: Route.MetaArgs) {
    return [
        { title: "LoginPage" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function Login() {
    return (

        <div className="flex justify-center items-center flex-col">

            <h1>Login page</h1>
            
            <form className="flex flex-col">
                <label>Usuario</label>
                <input />
                <label>Contraseña</label>
                <input />
            </form>

        </div>

    )
}
