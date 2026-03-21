import { Input } from "~/components/ui/input";
import type { Route } from "./+types/register";
import { Button } from "~/components/ui/button";
import { Form, useNavigation, type ActionFunctionArgs } from "react-router";
import Loader from "~/components/ui/loader";
import { Identity, type Credentials } from "~/domain/identity/identity.server";
import IdentityRepo from "~/application/repos/identity_repo.server";
import pool from "~/infra/db.server";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "LoginPage" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export async function action({ request }: ActionFunctionArgs) {
    const form = await request.formData()
    const data = {
        email: form.get("email") as string,
        password: form.get("password") as string,
    }
    const db = await pool.connect()
    const repo = new IdentityRepo()
    const exists = await repo.exists(db, data.email)
    if (exists) {
        return
        // Mostrar error de usuario ya existe al cliente
    }

    const user = await Identity.create(data)
    await repo.save(db, user)

    // Usuario guardado hay que hacer algo con eso, iniciar session
    // O redireccionarlo. O lo que queramos hacer
    return

}

export default function Register() {
    const navigation = useNavigation();
    const isSubmitting = navigation.state === 'submitting';

    return <div className="flex w-full min-h-[100svh] items-center justify-center">

        {
            isSubmitting ? <Loader /> :
                <div className="space-y-4" >
                    <h1 className="text-xl text-foreground">
                        Registrarse
                    </h1>
                    <Form
                        method='post'
                        className={
                            `bg-surface
                            min-w-sm
                            p-5
                            rounded-xl
                            space-y-2
                            flex
                            flex-col`
                        }>
                        <div>
                            <label>Usuario</label>
                            <Input
                                type="email"
                                name="email"
                                placeholder="email@example.com"
                            />

                        </div>
                        <div>
                            <label>Contraseña</label>
                            <Input
                                name="password"
                                type="password"
                                placeholder="**********"
                            />
                        </div>

                        <div>
                            <label>Repetir contraseña</label>
                            <Input
                                name="re-password"
                                type="password"
                                placeholder="**********"
                            />
                        </div>
                        <Button type="submit">
                            Guardar
                        </Button>
                    </Form>
                </div>
        }
    </div>;
}
