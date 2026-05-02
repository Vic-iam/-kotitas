import pool from "../../infra/db.server";
import IdentityRepo from "../repos/identity_repo.server";
import UserRepo from "../repos/user_repo.server";
import { Identity } from "../../domain/identity/identity.server";
import { User } from "../../domain/users/user.server";

const identityRepo = new IdentityRepo();
const userRepo = new UserRepo();

export class AuthService {
    /**
     * Authenticates a user by email and password.
     * Returns the user if successful, otherwise throws an error.
     */
    async login(email: string, password: string): Promise<User> {
        const client = await pool.connect();

        try {
            const identity = await identityRepo.findByEmail(client, email);
            if (!identity) {
                throw new Error("Invalid credentials");
            }

            console.log('Tamos aqui')

            const isValid = await identity.checkPassword(password);
            if (!isValid) {
                throw new Error("Invalid credentials");
            }

            const user = await userRepo.findByEmail(client, email);
            if (!user) {
                throw new Error("User not found for this identity");
            }

            return user;
        } finally {
            client.release();
        }
    }

    /**
     * Registers a new identity and user.
     * Performs both operations in a transaction.
     */
    async register(email: string, password: string, name: string): Promise<User> {
        const db = await pool.connect();
        try {
            await db.query("BEGIN");

            const exists = await identityRepo.exists(db, email);
            if (exists) {
                throw new Error("Email already registered");
            }

            const identity = await Identity.create({ email, password });
            await identityRepo.save(db, identity);
            const user = new User({
                name, email,
                identities: [{
                    provider_user_id: identity.id,
                    provider: "kotitas"
                }]
            });


            await userRepo.save(db, user);
            await db.query("COMMIT");

            return user;
        } catch (error) {
            await db.query("ROLLBACK");
            throw error;
        } finally {
            db.release();
        }
    }
}

export const authService = new AuthService();
