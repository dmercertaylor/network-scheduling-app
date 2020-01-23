const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();

router.get('/newMessages/:friendId', rejectUnauthenticated, async (req, res) => {
    try{
        const query = `
            WITH "updated" AS (
                UPDATE FROM "message" SET "status"=0
                WHERE "recipient"=$1
                AND "sender"=$2
                AND "status"=1
                RETURNING *
            )
            SELECT * FROM "updated" ORDER BY "time" ASC`
        const results = await pool.query(query, [req.user.user_id, req.params.friendId]);
        res.send(results.rows);
    } catch(error){
        console.log(error);
        res.sendStatus(500);
    }
});

router.get('/:friendId', rejectUnauthenticated, async (req, res) => {
    try {
        const query = `
            WITH "updated" AS (
                UPDATE "message" SET "status"=0
                WHERE "recipient"=$1
                AND "sender"=$2
                RETURNING *
            )
            SELECT * FROM "updated"
            UNION SELECT * FROM "message" WHERE "sender"=$1 AND "recipient"=$2
            ORDER BY "time" ASC`
        const results = await pool.query(query, [req.user.user_id, req.params.friendId]);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.post('/:friendId', rejectUnauthenticated, async (req, res) => {
    try{
        const query = `
            INSERT INTO "message" ("sender", "recipient", "content", "time")
            VALUES ($1, $2, $3, $4)`;
        const config = [
            req.user.user_id,
            req.params.friendId,
            req.body.content,
            req.body.time || Date.now()
        ];
        await pool.query(query, config);
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

module.exports = router;