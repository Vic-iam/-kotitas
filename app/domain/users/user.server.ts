import { v4 as uuid } from "uuid"

export type UserParams = {
    id?: string;
    name: string;
    email: string;
}

export class User {
    readonly id: string;
    readonly name: string;
    readonly email: string;

    constructor(params: UserParams) {
        this.id = params.id || uuid();
        this.name = params.name;
        this.email = params.email;
    }

    static fromDB(data: any): User {
        return new User({
            id: data.id,
            name: data.name,
            email: data.email
        });
    }
}
