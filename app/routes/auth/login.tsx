import {
  Form,
  Link,
  useActionData,
  useNavigation,
  type ActionFunctionArgs
} from "react-router";

import type { Route } from "./+types/login";
import Loader from "~/components/ui/loader";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useForm } from "react-hook-form";
import PasswordInput from "~/components/ui/passwordInput";

type FormData = {
  email: string;
  password: string;
};

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "LoginPage" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

/**
 * ACTION (backend)
 */
export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();

  const email = form.get("email");
  const password = form.get("password");

  if (!email || !password) {
    return { error: "Todos los campos son obligatorios" };
  }

  return;
}

/**
 * COMPONENTE LOGIN
 */
export default function Login() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const actionData = useActionData() as { error?: string };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData, e: any) => {
    e?.target.submit();
  };

  return (
    <div className="flex w-full min-h-[100svh] items-center justify-center">

      {isSubmitting ? (
        <Loader />
      ) : (
        <div className="space-y-4">

          <h1 className="text-xl text-center">
            Iniciar sesión
          </h1>

          {/* ERROR BACKEND */}
          {actionData?.error && (
            <p className="text-red-500 text-sm text-center">
              {actionData.error}
            </p>
          )}

          <Form
            method="post"
            onSubmit={handleSubmit(onSubmit)}
            className="bg-surface min-w-sm p-5 rounded-xl space-y-3 flex flex-col"
          >

            {/* EMAIL */}
            <div className="flex flex-col">
              <label>Correo electrónico</label>

              <Input
                type="email"
                placeholder="email@example.com"
                {...register("email", {
                  required: "Correo obligatorio",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Email inválido",
                  },
                })}
              />

              {errors.email && (
                <span className="text-red-400 text-xs">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* PASSWORD */}
            <div className="flex flex-col">
              <label>Contraseña</label>

              <PasswordInput
                type="password"
                placeholder="**********"
                {...register("password", {
                  required: "Contraseña obligatoria",
                  minLength: {
                    value: 6,
                    message: "Mínimo 6 caracteres",
                  },
                })}
              />

              {errors.password && (
                <span className="text-red-400 text-xs">
                  {errors.password.message}
                </span>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
            </Button>

            <p className="text-xs text-center">
              ¿No tienes cuenta?
              <Link to="/auth/register"> Registrate ahora</Link>
            </p>

          </Form>
        </div>
      )}
    </div>
  );
}
