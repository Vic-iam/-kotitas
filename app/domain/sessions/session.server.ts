import { v4 as uuid } from "uuid";
import { SESS_DURATION, SESS_ABSOLUTE_DURATION } from "../../../const.server";

type SessionParams = {
    user_id: string,
    ip: string,
    user_agent: string,
}

export class Session {
    readonly id: string
    readonly user_id: string
    readonly created_ip: string
    readonly created_ua: string
    readonly created_at: Date
    readonly last_seen_at: Date
    readonly last_seen_ip: string
    readonly expires_at: Date
    readonly absolute_expires_at: Date

    constructor(params: SessionParams) {
        const now = new Date();
        this.id = uuid();
        this.user_id = params.user_id;
        this.created_ip = params.ip;
        this.created_ua = params.user_agent;
        this.created_at = now;
        this.last_seen_at = now;
        this.last_seen_ip = params.ip;
        this.expires_at = new Date(now.getTime() + SESS_DURATION);
        this.absolute_expires_at = new Date(now.getTime() + SESS_ABSOLUTE_DURATION);
    }

    /**
     * Re-hydrates a Session from database data.
     */
    static fromDB(data: any): Session {
        const session = Object.create(Session.prototype);
        Object.assign(session, {
            id: data.id,
            user_id: data.user_id,
            created_ip: data.created_ip,
            created_ua: data.created_ua,
            created_at: new Date(data.created_at),
            last_seen_at: new Date(data.last_seen_at),
            last_seen_ip: data.last_seen_ip,
            expires_at: new Date(data.expires_at),
            absolute_expires_at: new Date(data.absolute_expires_at),
        });
        return session;
    }

    isExpired(): boolean {
        const now = new Date();
        return now > this.expires_at || now > this.absolute_expires_at;
    }

    /**
     * Updates the session's last seen activity and extends its sliding expiration.
     */
    touch(ip: string): Session {
        const now = new Date();
        const newExpiresAt = new Date(now.getTime() + SESS_DURATION);
        // Ensure we don't exceed the absolute expiration limit
        const expiresAt = newExpiresAt > this.absolute_expires_at ? this.absolute_expires_at : newExpiresAt;

        const updated = Object.create(Session.prototype);
        Object.assign(updated, this, {
            last_seen_at: now,
            last_seen_ip: ip,
            expires_at: expiresAt
        });
        return updated;
    }
}
