CREATE DATABASE "dmt_prime_solo";
\connect "dmt_prime_solo"

CREATE TABLE "user" (
  "id" SERIAL PRIMARY KEY,
  "full_name" varchar,
  "company" varchar,
  "location" varchar,
  "avatar_url" varchar,
  "email" varchar,
  "status" int DEFAULT 0
);

CREATE TABLE "login" (
  "id" SERIAL PRIMARY KEY,
  "username" varchar,
  "password" varchar,
  "user_id" INT REFERENCES "user" ("id")
);

CREATE TABLE "friends" (
  "int" SERIAL PRIMARY KEY,
  "user_id" int REFERENCES "user" ("id"),
  "friend_id" int REFERENCES "user" ("id"),
  "pending" int,
  "last_met" date,
  "met_at" varchar
);

CREATE TABLE "weekly_availability" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int REFERENCES "user" ("id"),
  "week_day" int,
  "start_time" time,
  "end_time" time
);

CREATE TABLE "matched_availability" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int REFERENCES "user" ("id"),
  "day" date,
  "start_time" time,
  "end_time" time
);