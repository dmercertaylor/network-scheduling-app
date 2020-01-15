const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();

router.get('/:searchTerm', rejectUnauthenticated, (req, res) => {
    const config = [req.user.user_id, req.params.searchTerm];
    const query = `
    SELECT * FROM "user" AS "u"
	LEFT JOIN (SELECT 1 AS "connected", "f"."user_id" FROM
		"user" AS "u" JOIN "friends" AS "f" ON "u"."id"="f"."user_id"
		WHERE "f"."friend_id" = $1 AND "f"."pending"=0
	) AS "fl" ON "u"."id"="fl"."user_id"
    WHERE "u"."id" != $1 AND
    ("u"."full_name" ILIKE '%$2%'
    OR "u"."company" ILIKE '%$2%'
    OR "u"."location" ILIKE '%2%';
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