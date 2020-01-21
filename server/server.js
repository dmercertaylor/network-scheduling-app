const express = require('express');
require('dotenv').config();

const app = express();
const bodyParser = require('body-parser');
const sessionMiddleware = require('./modules/session-middleware');
const CronJob = require('cron').CronJob;

const passport = require('./strategies/user.strategy');
const mailUsersConnections = require('./modules/mailUsersConnections')

const userRouter = require('./routes/user.router');
const emailRouter = require('./routes/email.router');
const profileRouter = require('./routes/profile.router');
const searchRouter = require('./routes/search.router');
const connectionsRouter = require('./routes/connections.router');
const availabilityRouter = require('./routes/availability.router');

app.use(bodyParser.json( {limit: '3.3mb'} ));
app.use(bodyParser.urlencoded({ extended: true, limit: '2mb'}));
app.use(express.static('build'));

app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/search', searchRouter);
app.use('/api/user', userRouter);
app.use('/api/email', emailRouter);
app.use('/api/profile', profileRouter);
app.use('/api/connections', connectionsRouter);
app.use('/api/availability', availabilityRouter);

const PORT = process.env.PORT || 5000;

// N: On a distributed server, you'd just move this to it's own process
// (which is not difficult). This cronjob is only running on this instance
// of node for the sake of brevity.
new CronJob('* * * * * 0', mailUsersConnections, null, true);

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
})