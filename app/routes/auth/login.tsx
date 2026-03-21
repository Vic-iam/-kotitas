import { Form, useNavigation } from "react-router";
import type { Route } from "./+types/login";
import Loader from "~/components/ui/loader";
import { Input } from "~/components/ui/input";
import { Button } from "@base-ui/react/button";


export function meta({ }: Route.MetaArgs) {
    return [
        { title: "LoginPage" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function Login() {
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
