import { v4 as uuid } from "uuid"

export type UserData = {
    email?: string,
    address?: string,
}

export class User {
    readonly id: string
    private _data: UserData


    constructor(data: ) {
        this.id = uuid()
    }
}
