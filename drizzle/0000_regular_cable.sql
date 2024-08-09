CREATE TABLE IF NOT EXISTS "pastes" (
	"uuid" uuid DEFAULT gen_random_uuid(),
	"content" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
