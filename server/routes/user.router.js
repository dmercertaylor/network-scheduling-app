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
    try {
        const form = req.body;
        const password = await encryptLib.encryptPassword(req.body.password);

        let query = `
            INSERT INTO "user" (full_name, company, location, email)
            VALUES ($1, $2, $3, $4) RETURNING id
        `;
        const idRows = await pool.query(query, [form.name, form.company, form.location, form.email]);
        query = `
            INSERT INTO "login" ("username", "password", "user_id")
            VALUES ($1, $2, $3)
        `
        pool.query(query, [form.username, password, idRows.rows[0].id])
            .then(results => {
                res.sendStatus(200);
            });
    } catch (error) {
        res.sendStatus(500);
        console.log(error);
    }
});

router.post('/login', userStrategy.authenticate('local'), (req, res) => {
    res.sendStatus(200);
});

router.post('/logout', (req, res) => {
    req.logout();
    res.sendStatus(200);
});

module.exports = router;