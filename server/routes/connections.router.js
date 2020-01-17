const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();

router.get('/', rejectUnauthenticated, (req, res) => {
    const config = [req.user.user_id];
    const query = `
        SELECT * FROM "friends" AS "f"
            JOIN "user" AS "u" ON "u"."id"="f"."friend_id"
            WHERE "f"."user_id"=$1
            ORDER BY
                "f"."pending" DESC,
                "f"."id" ASC`;
    pool.query(query, config)
        .then(results => {
            res.send(results.rows);
        })
        .catch(error => {
            res.sendStatus(500);
            console.log(error);
        })
});

router.post('/sendRequest', rejectUnauthenticated, (req, res) => {
    const config=[req.user.user_id, req.body.friend_id, req.body.met_at];
    const query = `SELECT "send_friend_request"($1, $2, $3)`; 
    pool.query(query, config)
        .then(results => res.sendStatus(200))
        .catch(error => {
            console.log(error);
            res.sendStatus(500);
        });
});

router.delete('/:friend_id', rejectUnauthenticated, (req, res) => {
    const query = 
    `DELETE FROM "friends"
        WHERE ("user_id"=$1 AND "friend_id"=$2)
        OR ("friend_id"=$1 AND "user_id"=$2)`;
    pool.query(query, [req.user.user_id, req.params.friend_id])
        .then(results => res.sendStatus(200))
        .catch(error => {
            res.sendStatus(500);
            console.log(error);
        });
});

router.put('/acceptConnection/:friend_id', rejectUnauthenticated, (req, res) => {
    const config=[req.user.user_id, req.params.friend_id];
    const query=`
        UPDATE "friends" SET "pending"=0
            WHERE ("user_id"=$1 AND "friend_id"=$2)
            OR ("user_id"=$2 AND "friend_id"=$1)`;
    pool.query(query, config)
        .then(response => res.sendStatus(200))
        .catch(error => {
            console.log(error);
            res.sendStatus(500);
        });
});

module.exports = router;