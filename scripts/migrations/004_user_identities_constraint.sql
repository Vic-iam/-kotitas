ALTER TABLE user_identities
    ADD CONSTRAINT user_identities_user_provider_unique UNIQUE (user_id, provider);
