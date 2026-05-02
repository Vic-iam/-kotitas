import argon2 from "argon2"
import { randomBytes, randomInt } from 'crypto';
import { v4 as uuid } from "uuid"

export type Credentials = {
    email: string,
    password: string,
}

type IdentityDB = {
    id: string,
    email: string,
    hash: string,
    created_at: Date,
    updated_at?: Date,
}

export class Identity {

    private constructor(
        readonly id: string,
        readonly email: string,
        private _hash: string,
        readonly createdAt?: Date,
        readonly updatedAt?: Date,
    ) { }

    public get hash(): string {
        return this._hash;
    }

    public static async create(creds: Credentials): Promise<Identity> {
        const salt = randomBytes(64)
        const cycles = randomInt(5, 10)
        return new Identity(
            uuid(),
            creds.email,
            await Identity.hashPassword(
                creds.password,
                salt,
                cycles,
            ),
        );
    }


    public async checkPassword(password: string): Promise<boolean> {
        try {
            return await argon2.verify(this._hash, password);
        } catch (err) {
            console.error("Error verifying password:", err);
            return false;
        }
    }

    public static fromDB(data: IdentityDB): Identity {
        return new Identity(
            data.id,
            data.email,
            data.hash,
            data.created_at,
            data.updated_at,
        );
    }

    private static async hashPassword(
        password: string,
        salt: Buffer<ArrayBufferLike>,
        cycles: number,
    ): Promise<string> {
        try {
            const hash = await argon2.hash(password, {
                type: argon2.argon2id,
                salt: salt,
                memoryCost: 64 * 1024,
                timeCost: cycles,
                parallelism: 2,
            });
            return hash;
        } catch (err) {
            console.error("Error hashing password:", err);
            throw err;
        }
    }
}
