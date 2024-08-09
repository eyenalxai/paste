ALTER TABLE "pastes" ADD PRIMARY KEY ("uuid");--> statement-breakpoint
ALTER TABLE "pastes" ALTER COLUMN "uuid" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "pastes" ALTER COLUMN "content" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "pastes" ALTER COLUMN "created_at" DROP NOT NULL;