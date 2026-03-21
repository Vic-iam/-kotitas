
CREATE TABLE IF NOT EXISTS identities (
    id UUID PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    hash BYTEA,
    salt BYTEA,
    cycles INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


