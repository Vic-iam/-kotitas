import type { PoolClient } from "pg";
import { Session } from "../../domain/sessions/session.server";
import { pcall } from "../../utils/pcall";

export default class SessionRepo {

    async save(client: PoolClient, session: Session): Promise<void> {
        const [ok, err] = await pcall(() => client.query(
            `INSERT INTO sessions (
                id,
                user_id,
                expires_at,
                absolute_expires_at,
                created_at,
                created_ip,
                created_ua,
                last_seen_at,
                last_seen_ip
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT (id) DO UPDATE SET
                expires_at = EXCLUDED.expires_at,
                last_seen_at = EXCLUDED.last_seen_at,
                last_seen_ip = EXCLUDED.last_seen_ip`,
            [
                session.id,
                session.user_id,
                session.expires_at,
                session.absolute_expires_at,
                session.created_at,
                session.created_ip,
                session.created_ua,
                session.last_seen_at,
                session.last_seen_ip
            ]
        ));

        if (!ok) {
            console.error("Failed to save session:", err);
            throw err;
        }
    }

    async findById(client: PoolClient, id: string): Promise<Session | null> {
        const [ok, val] = await pcall(() => client.query(
            `SELECT * FROM sessions WHERE id = $1 LIMIT 1`,
            [id]
        ));

        if (!ok) {
            console.error("Failed to find session by id:", val);
            throw val;
        }

        if (val.rows.length === 0) return null;
        return Session.fromDB(val.rows[0]);
    }

    async delete(client: PoolClient, id: string): Promise<void> {
        const [ok, err] = await pcall(() => client.query(
            `DELETE FROM sessions WHERE id = $1`,
            [id]
        ));

        if (!ok) {
            console.error("Failed to delete session:", err);
            throw err;
        }
    }
}
