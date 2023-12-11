-- CREATING TABLES

CREATE TABLE IF NOT EXISTS "user" (
    "id" UUID NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "email" VARCHAR(120) NOT NULL UNIQUE,
    "password" VARCHAR(240) NOT NULL,
    "last_online" TIMESTAMPTZ,
    "bio" VARCHAR(240),
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,
    "photo_url" VARCHAR(240),

    PRIMARY KEY ("id")  -- Add primary key constraint here
);

CREATE TABLE IF NOT EXISTS "conversation" (
    "id" UUID NOT NULL,
    "group_id" UUID,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    PRIMARY KEY ("id"),  -- Add primary key constraint here
    FOREIGN KEY ("group_id") REFERENCES "group" ("id")  -- Add foreign key constraint here
);

CREATE TABLE IF NOT EXISTS "group" (
    "id" UUID NOT NULL,
    "name" VARCHAR(90),
    "description" VARCHAR(240),
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    PRIMARY KEY ("id")  -- Add primary key constraint here
);

CREATE TABLE IF NOT EXISTS "message" (
    "id" UUID NOT NULL,
    "conversation_id" UUID NOT NULL,
    "author_id" UUID NOT NULL,
    "replied_message_id" UUID,
    "content" VARCHAR(999),
    "written_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "sent_at" TIMESTAMPTZ,
    "received_by_all_at" TIMESTAMPTZ,
    read_by_all_at TIMESTAMPTZ,

    PRIMARY KEY ("id"),  -- Add primary key constraint here
    FOREIGN KEY ("author_id") REFERENCES "user" ("id"),  -- Add foreign key constraint here
    FOREIGN KEY ("conversation_id") REFERENCES "conversation" ("id")  -- Add foreign key constraint here
);

CREATE TABLE IF NOT EXISTS "participant" (
    "user_id" UUID NOT NULL,
    "conversation_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "removed_at" TIMESTAMPTZ,

    PRIMARY KEY ("user_id", "conversation_id"),  -- Add primary key constraint here
    FOREIGN KEY ("user_id") REFERENCES "user" ("id"),  -- Add foreign key constraint here
    FOREIGN KEY ("conversation_id") REFERENCES "conversation" ("id")  -- Add foreign key constraint here
);

CREATE TABLE IF NOT EXISTS "message_status" (
    "user_id" UUID NOT NULL,
    "conversation_id" UUID NOT NULL,
    "message_id" UUID NOT NULL,
    "received_at" TIMESTAMPTZ,
    "read_at" TIMESTAMPTZ,

    PRIMARY KEY ("user_id", "message_id", "conversation_id"),  -- Add primary key constraint here
    FOREIGN KEY ("user_id") REFERENCES "user" ("id"),  -- Add foreign key constraint here
    FOREIGN KEY ("conversation_id") REFERENCES "conversation" ("id"),  -- Add foreign key constraint here
    FOREIGN KEY ("message_id") REFERENCES "message" ("id")  -- Add foreign key constraint here
);

-- CREATING INDEXES

-- User
CREATE INDEX IDX_User_Email ON "user" ("email");