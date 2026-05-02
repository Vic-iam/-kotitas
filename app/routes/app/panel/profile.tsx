import { type ActionFunctionArgs, Form } from "react-router";
import { logout } from "../../../infra/auth.server";
import { Button } from "~/components/ui/button";


export async function action({ request }: ActionFunctionArgs) {
    return await logout(request);
}

export default function Profile() {

    return (
        <div className="flex w-full min-h-[100svh] items-center justify-center">
            <div className="bg-surface p-8 rounded-xl shadow-lg space-y-6 min-w-[320px]">
                <h1 className="text-2xl font-bold text-center">Perfil de Usuario</h1>

                <Form method="post">
                    <Button type="submit" variant="destructive" className="w-full">
                        Cerrar Sesión
                    </Button>
                </Form>
            </div>
        </div>
    );
}
