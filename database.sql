--DROP TABLE "login";
--DROP TABLE "friends";
--DROP TABLE "weekly_availability";
--DROP TABLE "user";
--DROP TABLE "message";

CREATE TABLE "user" (
  "id" SERIAL PRIMARY KEY,
  "full_name" varchar,
  "company" varchar,
  "location" varchar,
  "avatar_url" varchar,
  "preferred_contact" varchar,
  "email" varchar,
  "status" int DEFAULT 0, -- 0: available, 1: unavailable
  "notifications" int DEFAULT 1 -- 0 for none, 1 for just emails.
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

CREATE TABLE "message" (
	"id" SERIAL PRIMARY KEY,
	"time" TIMESTAMP DEFAULT CURRENT_TIMESTAMP(0),
	"content" VARCHAR,
	"status" int DEFAULT 1, -- 0: recieved, 1: sent
	"sender" int REFERENCES "user"("id"),
	"recipient" int REFERENCES "user" ("id")
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

CREATE OR REPLACE FUNCTION "send_message" ("sender_id" INT, "receive_id" INT, "message" VARCHAR, "time" TIMESTAMP)
RETURNS void AS $$
BEGIN
	IF EXISTS (
		SELECT 1 FROM "friends"
		WHERE "user_id"=$1 AND "friend_id"=$2 AND "pending"=0
	)
	THEN INSERT INTO "message" ("sender", "recipient", "content", "time")
	VALUES ($1, $2, $3, $4);
	END IF;
END;
$$ LANGUAGE 'plpgsql';