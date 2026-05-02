import { redirect } from "react-router";
import { getSession, commitSession, destroySession, getClientInfo } from "./session_storage.server";
import { Session } from "../domain/sessions/session.server";

/**
 * Creates a new session for the given user and returns a redirect response with the session cookie.
 */
export async function createAuthenticatedSession(
    request: Request,
    user_id: string,
    redirectTo: string = "/app/dashboard",
) {
    const { ip, user_agent } = getClientInfo(request);

    // Create the domain session
    const domainSession = new Session({ user_id, ip, user_agent });

    // React Router session storage
    const session = await getSession();
    session.set("domain", domainSession);

    return redirect(redirectTo, {
        headers: {
            "Set-Cookie": await commitSession(session),
        },
    });
}

export async function getAuthenticatedSession(request: Request): Promise<Session | null> {
    const cookie = request.headers.get("Cookie");
    const session = await getSession(cookie);
    const domainSession = session.get("domain");

    if (!domainSession ||
        !(domainSession instanceof Session) || domainSession.isExpired()) {
        return null;
    }

    return domainSession;
}

export async function requireAuthenticatedSession(request: Request): Promise<Session> {
    const domainSession = await getAuthenticatedSession(request);

    if (!domainSession) {
        throw redirect("/auth/login", {
            headers: {
                "Set-Cookie": await destroySession(
                    await getSession(request.headers.get("Cookie")),
                ),
            },
        });
    }

    return domainSession;
}


export async function logout(request: Request) {
    const session = await getSession(request.headers.get("Cookie"));
    return redirect("/", {
        headers: {
            "Set-Cookie": await destroySession(session),
        },
    });
}
