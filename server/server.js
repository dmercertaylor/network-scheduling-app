const express = require('express');
require('dotenv').config();

const app = express();
const bodyParser = require('body-parser');
const sessionMiddleware = require('./modules/session-middleware');

const passport = require('./strategies/user.strategy');

const userRouter = require('./routes/user.router');
const emailRouter = require('./routes/email.router');
const profileRouter = require('./routes/profile.router');

app.use(bodyParser.json( {limit: '2mb'} ));
app.use(bodyParser.urlencoded({ extended: true, limit: '2mb'}));

app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/user', userRouter);
app.use('/api/email', emailRouter);
app.use('/api/profile', profileRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
})