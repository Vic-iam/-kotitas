import type { Route } from "./+types/register";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "LoginPage" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function Register() {
    return <div className="bg-red-500">RegisterPage</div>;
}
