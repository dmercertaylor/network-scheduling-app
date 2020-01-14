const cookieSession = require('cookie-session');

module.exports = cookieSession({
    secret: process.env.SERVER_SESSION_SECRET || 'bad_secret', // set in .env
    key: 'user', // name req.[variable]
    resave: 'false',
    saveUninitialized: false,
    maxAge: 60 * 60 * 1000, // 1 hour
    secure: false
});