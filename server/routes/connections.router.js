const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();

router.post('/sendRequest', rejectUnauthenticated, (req, res) => {
    const config=[req.user.user_id, req.body.friend_id, req.body.met_at];
    const query = `
        IF NOT EXISTS (
            SELECT 1 FROM "friends"
                WHERE ("user_id"=$1 AND "friend_id"=$2)
                OR ("user_id"=$2 AND "friend_id"=$1)
        )
        THEN INSERT INTO "friends" ("user_id", "friend_id", "met_at")
            VALUES ($1, $2, $3), ($2, $1, $3)
        ELSE UPDATE "friends" SET "pending"=0
            WHERE "user_id"=$1 OR "user_id"=$2
        END IF`; 
    pool.query(query, config)
        .then(response => res.sendStatus(200))
        .catch(error => {
            console.log(error);
            res.sendStatus(500);
        });
});

router.put('/confirmRequest', rejectUnauthenticated, (req, res) => {
    const config=[req.user.user_id, req.body.friend_id];
    const query=`UPDATE "friends" SET "pending"=0
        WHERE "user_id"=$1 OR "user_id"=$2`;
    pool.query(query, config)
        .then(response => res.sendStatus(200))
        .catch(error => {
            console.log(error);
            res.sendStatus(500);
        });
})

module.exports = router;