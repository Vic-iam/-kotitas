import { createSessionStorage, createCookie } from "react-router";
import pool from "./db.server";
import SessionRepo from "../application/repos/session_repo.server";
import { Session } from "../domain/sessions/session.server";

const sessionRepo = new SessionRepo();

const sessionCookie = createCookie("__session", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET || "s3cr3t"],
    secure: process.env.NODE_ENV === "production",
});

/**
 * Custom session storage that connects React Router sessions to our database-backed Session domain model.
 */
export const { getSession, commitSession, destroySession } = createSessionStorage({
    cookie: sessionCookie,
    async createData(data) {
        // data is the internal map of React Router's Session object.
        const sessionObj = data.domain as Session;
        if (!sessionObj) throw new Error("No domain session provided for creation");

        const client = await pool.connect();
        try {
            await sessionRepo.save(client, sessionObj);
            return sessionObj.id;
        } finally {
            client.release();
        }
    },
    async readData(id) {
        const client = await pool.connect();
        try {
            const session = await sessionRepo.findById(client, id);
            if (!session || session.isExpired()) {
                if (session) await sessionRepo.delete(client, id);
                return null;
            }
            // We store the rich domain model in the 'domain' key.
            return { domain: session };
        } finally {
            client.release();
        }
    },
    async updateData(id, data) {
        const sessionObj = data.domain as Session;
        if (!sessionObj) throw new Error("No domain session provided for update");

        const client = await pool.connect();
        try {
            await sessionRepo.save(client, sessionObj);
        } finally {
            client.release();
        }
    },
    async deleteData(id) {
        const client = await pool.connect();
        try {
            await sessionRepo.delete(client, id);
        } finally {
            client.release();
        }
    },
});

/**
 * Helper to extract client information for session creation.
 */
export function getClientInfo(request: Request) {
    const ip = request.headers.get("x-forwarded-for") || 
               request.headers.get("x-real-ip") || 
               "127.0.0.1";
    const user_agent = request.headers.get("user-agent") || "unknown";
    return { ip, user_agent };
}
