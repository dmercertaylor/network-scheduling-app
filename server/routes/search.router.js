const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();

router.get('/:searchTerm', rejectUnauthenticated, (req, res) => {
    const config = [req.user.user_id, `%${req.params.searchTerm}%`];
    const query = `
    SELECT * FROM "user" AS "u"
	LEFT JOIN (SELECT 1 AS "connected", "f"."pending" AS "pending", "f"."friend_id"
		FROM "friends" AS "f" WHERE "f"."user_id" = $1
	) AS "fl" ON "u"."id"="fl"."friend_id"
    WHERE "u"."id" != $1 AND
    "u"."full_name" ILIKE $2
    ORDER BY "u"."id"
    `
    pool.query(query, config)
        .then(results => {
            res.send(results.rows);
        }).catch(error => {
            console.log(error);
            res.sendStatus(500);
        })
});

module.exports = router;