CREATE DATABASE "dmt_prime_solo";
\connect "dmt_prime_solo"

--DROP TABLE "login";
--DROP TABLE "friends";
--DROP TABLE "weekly_availability";
--DROP TABLE "matched_availability";
--DROP TABLE "user";

CREATE TABLE "user" (
  "id" SERIAL PRIMARY KEY,
  "full_name" varchar,
  "company" varchar,
  "location" varchar,
  "avatar_url" varchar,
  "preferred_contact" varchar,
  "email" varchar,
  "status" int DEFAULT 0 -- 0: available, 1: unavailable
);

CREATE TABLE "login" (
  "id" SERIAL PRIMARY KEY,
  "username" varchar,
  "password" varchar,
  "user_id" INT REFERENCES "user" ("id")
);

CREATE TABLE "friends" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int REFERENCES "user" ("id"),
  "friend_id" int REFERENCES "user" ("id"),
  "pending" int DEFAULT 1, -- 0: not pending, 1: sent but not responded, 2: recieved but not responded
  "last_met" date,
  "skip_date" date,
  "met_at" varchar
);

CREATE TABLE "weekly_availability" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int REFERENCES "user" ("id"),
  "week_day" int,
  "start_time" time,
  "end_time" time
);

CREATE OR REPLACE FUNCTION "send_friend_request" ("user_id" INT, "friend_id" INT, "met_at" VARCHAR)
RETURNS void AS $$
BEGIN
	IF NOT EXISTS (
		SELECT $1 FROM "friends" AS "f"
		WHERE "f"."user_id"=$1 AND "f"."friend_id"=$2
	)
	THEN INSERT INTO "friends" ("user_id", "friend_id", "met_at", "pending")
	VALUES ($1, $2, $3, 1), ($2, $1, $3, 2);
	END IF;
END;
$$
LANGUAGE 'plpgsql';