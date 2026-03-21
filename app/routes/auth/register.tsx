import { Input } from "~/components/ui/input";
import type { Route } from "./+types/register";
import { Button } from "~/components/ui/button";
import { Form, useNavigation, type ActionFunctionArgs } from "react-router";
import Loader from "~/components/ui/loader";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "LoginPage" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export async function action({ request }: ActionFunctionArgs) {
    const data = await request.formData()
    console.log(data)
    return new Promise<number>((resolve, _) => setTimeout(() => resolve(0), 3000))
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
                            <Input />

                        </div>

                        <div>
                            <label>Contraseña</label>
                            <Input name="password" type="password" />
                        </div>

                        <div>
                            <label>Repetir contraseña</label>
                            <Input type="password" />
                        </div>
                        <Button type="submit">
                            Guardar
                        </Button>
                    </Form>
                </div>
        }
    </div>;
}
