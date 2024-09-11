CREATE TABLE IF NOT EXISTS "assistant_responses" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"tool_invocations" text,
	"usage" text,
	"finish_reason" varchar(256),
	"message_id" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chats" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"name" text,
	"description" text,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "messages" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"role" varchar(256) NOT NULL,
	"content" text NOT NULL,
	"chat_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "assistant_responses" ADD CONSTRAINT "assistant_responses_message_id_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."messages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chats" ADD CONSTRAINT "chats_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_chat_id_chats_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."chats"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
