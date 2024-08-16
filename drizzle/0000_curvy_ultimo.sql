CREATE SEQUENCE paste_id_seq;
ALTER SEQUENCE paste_id_seq MINVALUE 0;
ALTER SEQUENCE paste_id_seq RESTART WITH 0;

CREATE OR REPLACE FUNCTION auto_increment_alphanumeric(index_val BIGINT)
RETURNS TEXT LANGUAGE plpgsql AS $$
DECLARE
  chars TEXT := 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  base INT := LENGTH(chars);
  result TEXT := '';
  current_index BIGINT := index_val;
BEGIN
  LOOP
    result := SUBSTRING(chars FROM ((current_index % base) + 1)::INTEGER FOR 1) || result;
    current_index := TRUNC(current_index / base) - 1;
    EXIT WHEN current_index < 0;
  END LOOP;
  RETURN result;
END;
$$;

CREATE TABLE IF NOT EXISTS "pastes" (
	"id" text PRIMARY KEY DEFAULT auto_increment_alphanumeric(NEXTVAL('paste_id_seq')) NOT NULL,
	"content" "bytea" NOT NULL,
	"one_time" boolean,
	"iv_client_base64" text,
	"iv_server4" "bytea",
	"syntax" text NOT NULL,
	"link" boolean NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);

