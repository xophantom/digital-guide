CREATE TABLE "experience_guides" (
	"property_id" uuid PRIMARY KEY NOT NULL,
	"status" text NOT NULL,
	"welcome_message" text,
	"seasonal_tips" text,
	"restaurants" jsonb,
	"attractions" jsonb,
	"essentials" jsonb,
	"model" text,
	"error" text,
	"generated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "properties" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"property_type" text NOT NULL,
	"category" text NOT NULL,
	"bedroom_quantity" integer NOT NULL,
	"bathroom_quantity" integer NOT NULL,
	"guest_capacity" integer NOT NULL,
	"street" text NOT NULL,
	"number" text NOT NULL,
	"complement" text,
	"neighborhood" text NOT NULL,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"postal_code" text NOT NULL,
	"amenities" jsonb NOT NULL,
	"host_name" text NOT NULL,
	"host_phone" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "properties_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "property_access" (
	"property_id" uuid PRIMARY KEY NOT NULL,
	"wifi_network" text NOT NULL,
	"wifi_password" text NOT NULL,
	"is_self_checkin" boolean NOT NULL,
	"access_type" text NOT NULL,
	"access_instructions" text NOT NULL,
	"property_password" text,
	"has_parking_spot" boolean NOT NULL,
	"parking_identifier" text,
	"parking_instructions" text
);
--> statement-breakpoint
CREATE TABLE "property_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL,
	"url" text NOT NULL,
	"alt" text NOT NULL,
	"position" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "property_rules" (
	"property_id" uuid PRIMARY KEY NOT NULL,
	"check_in_time" text NOT NULL,
	"check_out_time" text NOT NULL,
	"allow_pet" boolean NOT NULL,
	"smoking_permitted" boolean NOT NULL,
	"suitable_for_children" boolean NOT NULL,
	"suitable_for_babies" boolean NOT NULL,
	"events_permitted" boolean NOT NULL
);
--> statement-breakpoint
ALTER TABLE "experience_guides" ADD CONSTRAINT "experience_guides_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_access" ADD CONSTRAINT "property_access_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_images" ADD CONSTRAINT "property_images_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_rules" ADD CONSTRAINT "property_rules_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;