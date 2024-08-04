CREATE TABLE IF NOT EXISTS "appointments" (
	"id" text PRIMARY KEY NOT NULL,
	"date" text,
	"time" text,
	"is_active" boolean,
	"modality" text,
	"patient_id" text,
	"professional_id" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "availability" (
	"id" serial PRIMARY KEY NOT NULL,
	"day_of_week" integer,
	"start_time_am" text,
	"end_time_am" text,
	"start_time_pm" text,
	"end_time_pm" text,
	"session_amount" integer,
	"professional_id" text,
	CONSTRAINT "availability_day_of_week_unique" UNIQUE("day_of_week")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "patients" (
	"id" text PRIMARY KEY NOT NULL,
	"first_name" text,
	"last_name" text,
	"dni" text,
	"age" integer,
	"gender" text,
	"type" text,
	"health_insurance" text,
	"tutor_id" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "professional_profile" (
	"id" text PRIMARY KEY NOT NULL,
	"first_name" text,
	"last_name" text,
	"email" text,
	"phone" text,
	"profession" text,
	"about_me" text,
	"address" text,
	"session_time" integer,
	"registration_number" text,
	CONSTRAINT "professional_profile_email_unique" UNIQUE("email"),
	CONSTRAINT "professional_profile_phone_unique" UNIQUE("phone"),
	CONSTRAINT "professional_profile_registration_number_unique" UNIQUE("registration_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tutors" (
	"id" text PRIMARY KEY NOT NULL,
	"first_name" text,
	"last_name" text,
	"dni" text,
	"email" text,
	"phone" text,
	"relationship_with_the_patient" text,
	CONSTRAINT "tutors_dni_unique" UNIQUE("dni")
);
--> statement-breakpoint
DROP TABLE "users";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "appointments" ADD CONSTRAINT "appointments_professional_id_professional_profile_id_fk" FOREIGN KEY ("professional_id") REFERENCES "public"."professional_profile"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "availability" ADD CONSTRAINT "availability_professional_id_professional_profile_id_fk" FOREIGN KEY ("professional_id") REFERENCES "public"."professional_profile"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patients" ADD CONSTRAINT "patients_tutor_id_tutors_id_fk" FOREIGN KEY ("tutor_id") REFERENCES "public"."tutors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
