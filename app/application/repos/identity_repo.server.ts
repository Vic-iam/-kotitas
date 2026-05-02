import type { PoolClient } from "pg";
import { Identity } from "~/domain/identity/identity.server";
import { pcall } from "~/utils/pcall";


export default class IdentityRepo {

    async save(client: PoolClient, id: Identity): Promise<void> {
        await client.query(
            `INSERT INTO identities (
                id,
                email,
                hash
            ) VALUES ($1, $2, $3)`,
            [
                id.id,
                id.email,
                id.hash,
            ]
        )
    }

    async findByEmail(client: PoolClient, email: string): Promise<Identity | null> {
        const [ok, val] = await pcall(() => client.query(
            `SELECT * FROM identities WHERE LOWER(email) = LOWER($1) LIMIT 1`,
            [email]
        ));

        if (!ok) throw val;
        if (val.rows.length === 0) return null;

        return Identity.fromDB(val.rows[0]);
    }

    async exists(client: PoolClient, email: string): Promise<boolean> {
        const [ok, val] = await pcall(() => client.query(
            `SELECT EXISTS (
            SELECT 1 
            FROM identities 
            WHERE LOWER(email) = LOWER($1)
            LIMIT 1)`, [email],
        ))

        if (!ok) throw val;
        return val.rows[0].exists ?? false
    }
}

