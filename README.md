# Email Scheduler

This is a simple React app which allows users to schedule emails to be sent from a specific gmail account (determined by the server).

## Setup

After running `npm i`, set up the database given in `database.sql`. If you are running it from localhost, simply add it's name as the variable `DATABASE_NAME` in the root directory `.env`.

The address and password of the account the emails will be sent from should be given in the root `.env` file as NODEMAILER_USER and NODEMAILER_PASS. Otherwise, emails can't be sent.

## Tools used

This project is meant to demonstrate a basic usage of nodemailer, node-cron, and moment.js, as well as the Flatpickr react implementation.