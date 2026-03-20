import type { Route } from "./+types/login";


export function meta({ }: Route.MetaArgs) {
    return [
        { title: "LoginPage" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function Login() {
    return <div>Login page</div>;
}
