import type { PoolClient } from "pg";
import type { Identity } from "~/domain/identity/identity.server";
import { pcall } from "~/utils/pcall";


export default class IdentityRepo {

    async save(client: PoolClient, id: Identity): Promise<void> {
        const [ok, err] = await pcall(() => client.query(
            `INSERT INTO identities (
                id,
                email,
                hash,
                salt,
                cycles
            ) VALUES ($1, $2, $3, $4, $5)`,
            [
                id.id,
                id.email,
                id.hash,
                id.salt,
                id.cycles
            ]
        ))

        if (ok) return
        console.log(err)
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

