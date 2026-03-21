// Componentes UI reutilizables
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import PasswordInput from "~/components/ui/passwordInput";

// Tipos de React Router
import type { Route } from "./+types/register";

// Hooks y utilidades de React Router (forms + navegación)
import {
  Form,
  Link,
  useActionData,
  useNavigation,
  type ActionFunctionArgs
} from "react-router";

// Loader visual mientras se envía el formulario
import Loader from "~/components/ui/loader";

// Lógica de dominio (creación de usuario)
import { Identity } from "~/domain/identity/identity.server";

// Repositorio para persistir en DB
import IdentityRepo from "~/application/repos/identity_repo.server";

// Conexión a base de datos
import pool from "~/infra/db.server";

// Manejo de formularios
import { useForm } from "react-hook-form";

// Hook de estado de React
import { useState } from "react";
import { get } from "http";


/**
 * Tipo que define la estructura de los datos del formulario
 */
type FormData = {
  name: string;
  email: string;
  password: string;
  rePassword: string;
};


/**
 * Meta información de la página (SEO / título)
 */
export function meta({ }: Route.MetaArgs) {
  return [
    { title: "LoginPage" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}


/**
 * Action (backend en React Router)
 * Se ejecuta cuando el usuario envía el formulario
 */
export async function action({ request }: ActionFunctionArgs) {

  // Obtener datos del formulario enviado
  const form = await request.formData();

  const data = {
    name: form.get("name") as string,
    email: form.get("email") as string,
    password: form.get("password") as string,
  };

  // Conexión a la base de datos
  const db = await pool.connect();

  // Instancia del repositorio
  const repo = new IdentityRepo();

  // Verifica si el usuario ya existe
  const exists = await repo.exists(db, data.email);

  if (exists) {
    // ⚠️ Aquí deberías devolver un error al frontend
    return;
  }

  // Crear entidad de usuario (incluye hash de password)
  const user = await Identity.create(data);

  // Guardar usuario en DB
  await repo.save(db, user);

  // ⚠️ Aquí deberías redirigir o iniciar sesión
  return;
}


/**
 * Componente principal de registro
 */
export default function Register() {

  // Estado de navegación (loading al enviar form)
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  // Datos devueltos desde el action (errores backend)
  const actionData = useActionData() as { error?: string };

  /**
   * Hook de React Hook Form
   * Maneja:
   * - registro de inputs
   * - validaciones
   * - errores
   */
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<FormData>();

  /**
   * Función que intercepta el submit
   * y deja que React Router maneje el envío real
   */
  const onSubmit = (data: FormData, e: any) => {
    e?.target.submit();
  };


  return (
    <div className="flex w-full min-h-[100svh] items-center justify-center">

      {
        // Mostrar loader mientras se envía
        isSubmitting ? <Loader /> :

          <div className="space-y-4">

            {/* Título */}
            <h1 className="text-xl text-foreground text-center">
              Registrarse
            </h1>

            {/* Error del backend */}
            {actionData?.error && (
              <span className="text-red-500 text-sm text-center block">
                {actionData.error}
              </span>
            )}

            {/* Formulario */}
            <Form
              method='post'
              onSubmit={handleSubmit(onSubmit)}
              className="
                bg-surface
                min-w-sm
                p-5
                rounded-xl
                space-y-2
                flex
                flex-col"
            >

              {/* INPUT NOMBRE */}
              <div className="flex flex-col gap-1">
                <label>Usuario</label>

                <Input
                  type="text"
                  placeholder="Nombre de usuario"

                  // Registro del input en RHF + validaciones
                  {...register("name", {
                    required: true,
                    minLength: 4
                  })}
                />

                {/* Errores de validación */}
                {errors?.name?.type === "required" &&
                  <span className="text-red-300 text-xs">
                    Nombre obligatorio
                  </span>
                }

                {errors?.name?.type === "minLength" &&
                  <span className="text-red-300 text-xs">
                    El nombre minimo necesita 4 caracteres
                  </span>
                }
              </div>


              {/* INPUT EMAIL */}
              <div className="flex flex-col">
                <label>Correo electronico</label>

                <Input
                  type="email"
                  placeholder="email@example.com"

                  {...register("email", {
                    required: true
                  })}
                />

                {errors?.email?.type === "required" &&
                  <span className="text-red-300 text-xs">
                    Correo obligatorio
                  </span>
                }
              </div>


              {/* INPUT PASSWORD (COMPONENTE REUTILIZABLE) */}
              <div className="flex flex-col">
                <label>Contraseña</label>

                <PasswordInput
                  {...register("password", {
                    required: true,
                    minLength: 6
                  })}
                />

                {errors.password &&
                  <span className="text-red-300 text-xs">
                    {errors.password.message}
                  </span>
                }
              </div>


              {/* INPUT CONFIRMAR PASSWORD */}
              <div className="flex flex-col">
                <label>Repetir contraseña</label>

                <PasswordInput 
                {...register("rePassword", {
                    required: true,
                    validate: (value) =>
                        value === getValues().password
                })}
                />

                {errors?.rePassword?.type === "validate" &&
                  <span className="text-red-300 text-xs">
                    Las contraseña no coinciden
                  </span>
                }
              </div>


              {/* BOTÓN SUBMIT */}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : "Guadar"}
              </Button>


              {/* LINK A LOGIN */}
              <p className="text-xs text-center">
                ¿Ya tienes una cuenta?
                <Link to="/auth/login"> Inicia sesion ahora</Link>
              </p>

            </Form>
          </div>
      }
    </div>
  );
}
