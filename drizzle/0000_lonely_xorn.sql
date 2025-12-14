CREATE TABLE "drops" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price" integer NOT NULL,
	"inventory_count" integer NOT NULL,
	"vibe_prompt" text NOT NULL,
	"generated_ui_config" jsonb,
	"status" text DEFAULT 'draft',
	"image_url" text,
	"flowglad_product_id" text,
	"slug" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "drops_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"drop_id" integer,
	"views" integer DEFAULT 0,
	"sales" integer DEFAULT 0,
	"revenue" integer DEFAULT 0,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "metrics" ADD CONSTRAINT "metrics_drop_id_drops_id_fk" FOREIGN KEY ("drop_id") REFERENCES "public"."drops"("id") ON DELETE no action ON UPDATE no action;