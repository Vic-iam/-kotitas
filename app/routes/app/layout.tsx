
import { redirect, Outlet } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { requireAuthenticatedSession } from "~/infra/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
    const session = await requireAuthenticatedSession(request);
    return { userId: session.user_id };
}


export default function AppLayout() {
    return <Outlet />;
}

