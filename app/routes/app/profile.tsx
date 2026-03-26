import { type ActionFunctionArgs, type LoaderFunctionArgs, Form } from "react-router";
import { requireAuthenticatedSession, logout } from "../../infra/auth.server";
import { Button } from "~/components/ui/button";
import type { Route } from "./+types/profile";
import pool from "../../infra/db.server";
import UserRepo from "../../application/repos/user_repo.server";

export async function loader({ request }: LoaderFunctionArgs) {
    const session = await requireAuthenticatedSession(request);
    
    // In a real app, we might want to fetch the full user from DB if not in session
    const userRepo = new UserRepo();
    const client = await pool.connect();
    try {
        const user = await userRepo.findById(client, session.user_id);
        if (!user) {
            // This shouldn't happen if session is valid and referential integrity holds
            return await logout(request);
        }
        return { user };
    } finally {
        client.release();
    }
}

export async function action({ request }: ActionFunctionArgs) {
    return await logout(request);
}

export default function Profile({ loaderData }: Route.ComponentProps) {
    const { user } = loaderData;

    return (
        <div className="flex w-full min-h-[100svh] items-center justify-center">
            <div className="bg-surface p-8 rounded-xl shadow-lg space-y-6 min-w-[320px]">
                <h1 className="text-2xl font-bold text-center">Perfil de Usuario</h1>
                
                <div className="space-y-2">
                    <p><span className="font-semibold text-muted-foreground">ID:</span> {user.id}</p>
                    <p><span className="font-semibold text-muted-foreground">Nombre:</span> {user.name}</p>
                    <p><span className="font-semibold text-muted-foreground">Email:</span> {user.email}</p>
                </div>

                <Form method="post">
                    <Button type="submit" variant="destructive" className="w-full">
                        Cerrar Sesión
                    </Button>
                </Form>
            </div>
        </div>
    );
}
