import { Link } from "react-router";
import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "New React Router App" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function Home() {
    return (

        <div className="flex w-full min-h-[100svh] items-center justify-center">

            <div className="flex items-center justify-center flex-col gap-5 bg-surface p-3 rounded-xl">
 
                <h1 className="text-xl">
                    Prueba de login y register
                </h1>
                <div className="flex gap-5 text-center">
                <Link to="/auth/login">Ir al login</Link>
                <Link to="/auth/register">Ir al register </Link>
                </div>
            </div>

        </div>
    )
}
