CREATE TABLE IF NOT EXISTS "pastes" (
	"id" varchar(5) PRIMARY KEY NOT NULL,
	"content" "bytea" NOT NULL,
	"one_time" boolean,
	"iv_client_base64" text,
	"iv_server4" "bytea",
	"syntax" varchar NOT NULL,
	"link" boolean NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
