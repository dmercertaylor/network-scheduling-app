# SQueue

[A deployed version of this app is available on heroku](dmt-scheduler.herokuapp.com).

SQueue is an app that allows users to manage their existing network by reminding them that people exist.


From the profile page, users may view and edit their profile information, as well as mark times on a week-long grid when they are available. They may also toggle their availability off entirely.

From the search page, they can search for and send connection requests to other users. Upon sending a connection request, users will be asked to indicate an event or a location where they met the user they are trying to connect to.

From their connections page, they may search among their connections, accept incoming connection requests, and remove existing connections.

Finally, on the availability page, they may see any user who's availability aligns with their own, ordered from who they've seen least recently to who they've seen most recently. If they have met with a connection, they may hit the "mark met" button, to indicate when that occured. Additionally, if they want to push a connection to the back of the queue without meeting with them, they may "skip" them, which will send them to the back of the queue.

## Tools used

The primary tech stack for this project includes Postgres, Node.js/Express, and React, with Redux and Sagas on the frontend, and Material-UI for styling. Additionally, Passport and BCrypt were used for authentication, and user avatars are hosted on AWS S3. Nodemailer is used to send emails, and Cron was used to handle timing emails.

## Setup

In order to get this project running, you will need Node.js, as well as access to a Postgres database (either remotely or locally). If you have git, the codebase can be downloaded by running:

```
git clone https://github.com/dmercertaylor/prime-solo-project.git
npm i
```

Database setup is included in database.sql. After creating a database, simply run the listed queries into it.

Additionally, you will need to create a `.env` file, defining the following variables:

```
# the service name that nodemailer will run on
NODEMAILER_SERVICE=
# Username that nodemailer can use to get into the service
NODEMAILER_USER=
# Password for Nodemailer's account
NODEMAILER_PASS=
# if you are running a local postgres database, set this to the database name. If you are using a remote DB, set DATABASE_URL instead.
DATABASE_NAME=

# The name of the S3 bucket that will be used to upload user avatars
S3_BUCKET_NAME=
# The access key to an IAM account with access to your bucket.
AWS_ACCESS_KEY_ID=
# The secret access key which corresponds to the access key above.
AWS_SECRET_ACCESS_KEY=

# Random key that server will use for authentication
SERVER_SESSION_SECRET=
```