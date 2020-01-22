const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();
const getUserAvailableMatches = require('../modules/getUserAvailableMatches');

router.get('/:searchTerm', rejectUnauthenticated, async (req, res) => {
    try{
        if(req.query.available){
            const available = await getUserAvailableMatches(req.user.user_id, null, req.params.searchTerm);
            res.send(available);
        }else {
            const config = [req.user.user_id, `%${req.params.searchTerm}%`];
            let query = `
                SELECT * FROM "user" AS "u"
                ${req.query.myConnections ? 'RIGHT' : 'LEFT'} JOIN (
                    ${req.query.myConnections ? 
                        'SELECT *' :
                        'SELECT 1 AS "connected", "f"."pending" AS "pending", "f"."friend_id"'
                    }
                    FROM "friends" AS "f" WHERE "f"."user_id" = $1
                    ) AS "fl" ON "u"."id"="fl"."friend_id"
                WHERE "u"."id" != $1 AND
                "u"."full_name" ILIKE $2
                ORDER BY "u"."id"
                `;
            const results = await pool.query(query, config)
            res.send(results.rows);
        }
    } catch(error){
        console.log(error);
        res.sendStatus(500);
    }
});

module.exports = router;