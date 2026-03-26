import type { PoolClient } from "pg";
import { User } from "../../domain/users/user.server";
import { pcall } from "../../utils/pcall";

export default class UserRepo {

    async save(client: PoolClient, user: User): Promise<void> {
        const [ok, err] = await pcall(() => client.query(
            `INSERT INTO users (
                id,
                name,
                email
            ) VALUES ($1, $2, $3)
            ON CONFLICT (id) DO UPDATE SET
                name = EXCLUDED.name,
                email = EXCLUDED.email`,
            [
                user.id,
                user.name,
                user.email
            ]
        ));

        if (!ok) {
            console.error("Failed to save user:", err);
            throw err;
        }
    }

    async findByEmail(client: PoolClient, email: string): Promise<User | null> {
        const [ok, val] = await pcall(() => client.query(
            `SELECT * FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1`,
            [email]
        ));

        if (!ok) throw val;
        if (val.rows.length === 0) return null;
        return User.fromDB(val.rows[0]);
    }

    async findById(client: PoolClient, id: string): Promise<User | null> {
        const [ok, val] = await pcall(() => client.query(
            `SELECT * FROM users WHERE id = $1 LIMIT 1`,
            [id]
        ));

        if (!ok) throw val;
        if (val.rows.length === 0) return null;
        return User.fromDB(val.rows[0]);
    }
}
