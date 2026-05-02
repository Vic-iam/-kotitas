CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS user_identities (
    user_id UUID NOT NULL,
    provider_user_id UUID NOT NULL,
    provider VARCHAR(20) NOT NULL
);

ALTER TABLE user_identities
    ADD CONSTRAINT user_identities_user_provider_unique UNIQUE (user_id, provider);
