import type { Route } from "./+types/login";


export function meta({ }: Route.MetaArgs) {
    return [
        { title: "LoginPage" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function Login() {
    return (

        <div className="flex justify-center gap-5 items-center flex-col bg min-h-screen text-[var(--color-text)] shadow-md shadow-[var(--color-surface)]">

            <form className="flex flex-col bg-primary p-10 text-xl rounded-sm">
                <h1 className="text-xl text-center">Login page</h1>

                <label>Usuario</label>
                <input className="border-1 border-[var(--color-border)] rounded-sm" />
                <label>Contraseña</label>
                <input className="border-1 border-[var(--color-border)] rounded-sm"/>
            </form>

        </div>

    )
}
