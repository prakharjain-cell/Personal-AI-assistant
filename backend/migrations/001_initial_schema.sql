-- Step 1: initial PostgreSQL schema for the Personal AI Vault.
-- File bytes belong in private file storage; documents.storage_key is only a reference.
-- Authentication fields (including password hashes) are intentionally deferred to Step 3.

BEGIN;

CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT users_email_lowercase CHECK (email = LOWER(email)),
    CONSTRAINT users_email_not_blank CHECK (LENGTH(TRIM(email)) > 0),
    CONSTRAINT users_display_name_not_blank CHECK (LENGTH(TRIM(display_name)) > 0)
);

CREATE TABLE documents (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    original_filename TEXT NOT NULL,
    media_type TEXT,
    size_bytes BIGINT NOT NULL CHECK (size_bytes >= 0),
    category TEXT,
    storage_key TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT documents_filename_not_blank CHECK (LENGTH(TRIM(original_filename)) > 0),
    CONSTRAINT documents_storage_key_not_blank CHECK (LENGTH(TRIM(storage_key)) > 0)
);

CREATE TABLE tasks (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    due_at TIMESTAMPTZ,
    priority TEXT NOT NULL DEFAULT 'normal'
        CHECK (priority IN ('normal', 'high')),
    status TEXT NOT NULL DEFAULT 'open'
        CHECK (status IN ('open', 'completed')),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT tasks_title_not_blank CHECK (LENGTH(TRIM(title)) > 0),
    CONSTRAINT tasks_completion_time_matches_status CHECK (
        (status = 'completed' AND completed_at IS NOT NULL)
        OR (status = 'open' AND completed_at IS NULL)
    )
);

CREATE TABLE conversations (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE chat_messages (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    conversation_id BIGINT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    -- Reserved for non-secret details such as future document citations.
    metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chat_messages_content_not_blank CHECK (LENGTH(TRIM(content)) > 0)
);

CREATE TABLE user_preferences (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    preference_key TEXT NOT NULL,
    preference_value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, preference_key),
    CONSTRAINT user_preferences_key_not_blank CHECK (LENGTH(TRIM(preference_key)) > 0)
);

CREATE INDEX documents_user_created_idx
    ON documents (user_id, created_at DESC);
CREATE INDEX tasks_user_status_due_idx
    ON tasks (user_id, status, due_at);
CREATE INDEX conversations_user_updated_idx
    ON conversations (user_id, updated_at DESC);
CREATE INDEX chat_messages_conversation_created_idx
    ON chat_messages (conversation_id, created_at);

COMMIT;
