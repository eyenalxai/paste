CREATE TABLE IF NOT EXISTS "pastes" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content" text NOT NULL,
	"one_time" boolean,
	"expires_at" timestamp with time zone NOT NULL
);
