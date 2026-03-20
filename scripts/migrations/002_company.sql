
CREATE TABLE IF NOT EXISTS company (
    id UUID PRIMARY KEY NOT NULL,
    name TEXT NOT NULL
);


CREATE TABLE IF NOT EXISTS user_company_roles (
    user_id UUID NOT NULL REFERENCES  user_profiles(id),
    company_id UUID NOT NULL REFERENCES company(id),
    role VARCHAR(50) NOT NULL
);

