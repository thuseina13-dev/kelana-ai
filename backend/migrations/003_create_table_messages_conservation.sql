-- Migration: 003_create_messages_conservation
-- Creates the conservations and messages tables

CREATE TABLE IF NOT EXISTS conservations (
    id                      BIGSERIAL     PRIMARY KEY,
    user_id                 BIGINT        REFERENCES users(id) ON DELETE SET NULL,
    title                   VARCHAR(255),
    created_at              TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_conservations_user_id
    ON conservations(user_id);

CREATE TABLE IF NOT EXISTS messages (
    id                      BIGSERIAL     PRIMARY KEY,
    conservation_id         BIGINT        REFERENCES conservations(id) ON DELETE SET NULL,
    role                    VARCHAR(50)   NOT NULL,
    content                 TEXT          NOT NULL,
    created_at              TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_conservation_id
    ON messages(conservation_id);