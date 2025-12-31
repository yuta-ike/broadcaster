CREATE TABLE "labels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"label" text NOT NULL UNIQUE,
	"color" text NOT NULL,
	"order" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sponsor_labels" (
	"sponsor_id" uuid NOT NULL,
	"label_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sponsor_labels_sponsor_id_label_id_unique" UNIQUE("sponsor_id","label_id")
);
--> statement-breakpoint
CREATE TABLE "sponsor_slack_users" (
	"slack_user_id" text PRIMARY KEY,
	"sponsor_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sponsors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL,
	"readable_id" text NOT NULL UNIQUE,
	"slack_channel_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sponsor_labels" ADD CONSTRAINT "sponsor_labels_sponsor_id_sponsors_id_fkey" FOREIGN KEY ("sponsor_id") REFERENCES "sponsors"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "sponsor_labels" ADD CONSTRAINT "sponsor_labels_label_id_labels_id_fkey" FOREIGN KEY ("label_id") REFERENCES "labels"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "sponsor_slack_users" ADD CONSTRAINT "sponsor_slack_users_sponsor_id_sponsors_id_fkey" FOREIGN KEY ("sponsor_id") REFERENCES "sponsors"("id") ON DELETE CASCADE ON UPDATE CASCADE;