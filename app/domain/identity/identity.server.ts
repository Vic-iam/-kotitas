import argon2 from "argon2"
import { randomBytes, randomInt } from 'crypto';
import { v4 as uuid } from "uuid"

export type Credentials = {
    email: string,
    password: string,
}

export class Identity {

    private constructor(
        readonly id: string,
        readonly email: string,
        private _salt: Buffer<ArrayBufferLike>,
        private _cycles: number,
        private _hash: string,
        readonly createdAt?: Date,
        readonly updatedAt?: Date,
    ) { }

    public get salt(): Buffer<ArrayBufferLike> {
        return this._salt;
    }

    public get cycles(): number {
        return this._cycles;
    }

    public get hash(): string {
        return this._hash;
    }

    public static async create(creds: Credentials): Promise<Identity> {
        const salt = randomBytes(64)
        const cycles = randomInt(5, 10)
        return new Identity(
            uuid(),
            creds.email,
            salt,
            cycles,
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

    public static fromDB(data: any): Identity {
        return new Identity(
            data.id,
            data.email,
            data.salt,
            data.cycles,
            data.hash,
            data.created_at ? new Date(data.created_at) : undefined,
            data.updated_at ? new Date(data.updated_at) : undefined,
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
