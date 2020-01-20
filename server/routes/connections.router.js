const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();

const send500 = res => error => {
    res.sendStatus(500);
    console.log(error);
} 

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
        .then(results => res.send(results.rows))
        .catch(send500(res))
});

router.put('/newMeeting/:id', rejectUnauthenticated, (req, res) => {
    const query = `
        UPDATE "friends" SET "last_met"=$1
        WHERE (("user_id" = $2 AND "friend_id" = $3)
            OR ("user_id" = $3 AND "friend_id" = $2))
        AND ("last_met" < $1 OR "last_met" IS NULL)`;
    console.log(req.body.date, req.user.user_id, req.params.id);
    pool.query(query, [new Date(req.body.date), req.user.id, req.params.id])
        .then(results => res.sendStatus(200))
        .catch(send500(res));
});

router.put('/skip/:id', rejectUnauthenticated, (req, res) => {
    const query = `
        UPDATE "friends" SET "skip_date"=CURRENT_DATE
        WHERE "user_id" = $1 AND "friend_id" = $2`;
    
    pool.query(query, [req.user.user_id, req.params.id])
        .then(results => res.sendStatus(200))
        .catch(send500(res))
})

router.post('/sendRequest', rejectUnauthenticated, (req, res) => {
    const config=[req.user.user_id, req.body.friend_id, req.body.met_at];
    const query = `SELECT "send_friend_request"($1, $2, $3)`; 
    pool.query(query, config)
        .then(results => res.sendStatus(200))
        .catch(send500(res));
});

router.delete('/:friend_id', rejectUnauthenticated, (req, res) => {
    const query = 
    `DELETE FROM "friends"
        WHERE ("user_id"=$1 AND "friend_id"=$2)
        OR ("friend_id"=$1 AND "user_id"=$2)`;
    pool.query(query, [req.user.user_id, req.params.friend_id])
        .then(results => res.sendStatus(200))
        .catch(send500(res));
});

router.put('/acceptConnection/:friend_id', rejectUnauthenticated, (req, res) => {
    const config=[req.user.user_id, req.params.friend_id];
    const query=`
        UPDATE "friends" SET "pending"=0
            WHERE ("user_id"=$1 AND "friend_id"=$2)
            OR ("user_id"=$2 AND "friend_id"=$1)`;
    pool.query(query, config)
        .then(response => res.sendStatus(200))
        .catch(send500(res));
});

module.exports = router;