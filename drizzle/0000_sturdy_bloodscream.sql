CREATE TABLE IF NOT EXISTS "pastes" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content" text NOT NULL,
	"one_time" boolean,
	"iv_base64" text,
	"language" varchar,
	"expires_at" timestamp with time zone NOT NULL
);
