
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY NOT NULL,
    name TEXT NOT NULL
);


CREATE TABLE IF NOT EXISTS user_company_roles (
    user_id UUID NOT NULL REFERENCES  users(id),
    company_id UUID NOT NULL REFERENCES companies(id),
    role VARCHAR(50) NOT NULL
);

