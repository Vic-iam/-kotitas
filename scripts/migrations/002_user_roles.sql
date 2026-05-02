
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY NOT NULL,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID REFERENCES users(id),
    rol_id UUID REFERENCES roles(id)
);


