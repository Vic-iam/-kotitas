import type { PoolClient } from "pg";
import { User, type UserIdentity } from "../../domain/users/user.server";
import { pcall } from "../../utils/pcall";

export default class UserRepo {

    async save(client: PoolClient, user: User): Promise<void> {
        try {
            await client.query(
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
            )
            user.identities.forEach(async (i) => {
                await this.saveIdentity(client, user.id, i)
            });
        } catch (e) {
            throw e
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
        const identities = await this.findIdentitiesByUserId(client, id);
        return User.fromDB(val.rows[0], identities);
    }

    async saveIdentity(client: PoolClient, userID: string, identity: UserIdentity): Promise<void> {
        const [ok, err] = await pcall(() => client.query(
            `INSERT INTO user_identities (
                user_id,
                provider_user_id,
                provider
            ) VALUES ($1, $2, $3)
             ON CONFLICT (user_id, provider) DO UPDATE SET
                provider_user_id = EXCLUDED.provider_user_id`,
            [
                userID,
                identity.provider_user_id,
                identity.provider,
            ]
        ));

        if (!ok) {
            console.error("Failed to save user identity:", err);
            throw err;
        }
    }

    async findIdentitiesByUserId(client: PoolClient, user_id: string): Promise<UserIdentity[]> {
        const [ok, val] = await pcall(() => client.query(
            `SELECT * FROM user_identities WHERE user_id = $1`,
            [user_id]
        ));

        if (!ok) throw val;
        return val.rows as UserIdentity[];
    }
}
