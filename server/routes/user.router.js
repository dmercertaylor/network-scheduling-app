const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');

const router = express.Router();

router.get('/', rejectUnauthenticated, (req, res) => {
    res.send(req.user);
});

router.post('/register', async (req, res, next) => {
    const username = req.body.username;
    const password = await encryptLib.encryptPassword(req.body.password);

    const query = 'INSERT INTO "user" (username, password) VALUES ($1, $2) RETURNING id';
    pool.query(query, [username, password])
        .then(()=> res.sendStatus(201))
        .catch(error => {
            console.log(error);
            res.sendStatus(500)
        });
});

router.post('/login', userStrategy.authenticate('local'), (req, res) => {
    res.sendStatus(200);
});

router.post('/logout', (req, res) => {
    req.logout();
    res.sendStatus(200);
});

module.exports = router;