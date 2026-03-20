import type { Route } from "./+types/register";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "LoginPage" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function Register() {
    return <div className="flex w-full min-h-[100svh] items-center justify-center">

        <div className="bg-surface p-2 rounded">
            <h1 className="text-xl text-foreground">Login page</h1>

            <form className="flex flex-col">
                <label>Usuario</label>
                <input />
                <label>Contraseña</label>
                <input />
            </form>

        </div>


    </div>;
}
