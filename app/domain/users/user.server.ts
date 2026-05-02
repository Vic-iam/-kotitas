import { v4 as uuid } from "uuid"

export type UserIdentity = {
    provider_user_id: string;
    provider: string;
}

export type UserParams = {
    id?: string;
    name: string;
    email: string;
    identities: UserIdentity[];
}

export class User {
    readonly id: string;
    readonly name: string;
    readonly email: string;
    readonly identities: UserIdentity[];

    constructor(params: UserParams) {
        this.id = params.id || uuid();
        this.name = params.name;
        this.email = params.email;
        this.identities = params.identities ?? [];
    }

    static fromDB(data: any, identities: UserIdentity[] = []): User {
        return new User({
            id: data.id,
            name: data.name,
            email: data.email,
            identities,
        });
    }
}
