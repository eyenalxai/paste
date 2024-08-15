CREATE TABLE IF NOT EXISTS "pastes" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content" "bytea" NOT NULL,
	"one_time" boolean,
	"iv_client_base64" text,
	"iv_server4" "bytea" NOT NULL,
	"syntax" varchar NOT NULL,
	"link" boolean NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
