const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const router = require('express').Router();
const pool = require('../modules/pool');
const getTimeOverlap = require('../modules/getTimeOverlap');

router.get('/', rejectUnauthenticated, async (req, res) => {
    try{
        const userQuery =  `
            SELECT "wa"."start_time", "wa"."end_time", "wa"."week_day"
            FROM "user" AS "u"
            JOIN "weekly_availability" AS "wa" ON "wa"."user_id"="u"."id"
            WHERE "u"."id" = $1`;
        const friendsQuery = `
            SELECT "f"."last_met", "f"."met_at", "fp"."id", "fp"."full_name", "fp"."company", "fp"."location", "fp"."avatar_url", "fp"."preferred_contact", "fp"."email", array_agg("wa"."start_time" ORDER BY "wa"."id") AS "start_times", array_agg("wa"."end_time" ORDER BY "wa"."id") AS "end_times", array_agg("wa"."week_day" ORDER BY "wa"."id") AS "week_days"
            FROM "user" AS "u"
            JOIN "friends" AS "f" ON "u"."id"="f"."user_id"
            JOIN "user" AS "fp" ON "f"."friend_id"="fp"."id"
            JOIN "weekly_availability" AS "wa" ON "wa"."user_id"="f"."friend_id"
            WHERE "u"."id"=$1 AND "f"."pending"=0 AND "fp"."status"=0
            GROUP BY "f"."friend_id", "fp"."id", "f"."last_met", "f"."met_at"
            ORDER BY GREATEST("f"."last_met", "f"."skip_date") DESC
            NULLS LAST`;

        let userTimes = await pool.query(userQuery, [req.user.user_id]);
        let friendTimes = await pool.query(friendsQuery, [req.user.user_id]);
        friendTimes = friendTimes.rows;
        userTimes = userTimes.rows;

        const matched = [];
        
        friendTimes.forEach(friend => {
            const newTimes = friend;
            newTimes.times = [];
            for(let i=0; i<friend.week_days.length; i++){
                fTimes = {
                    start_time: friend.start_times[i],
                    end_time: friend.end_times[i],
                    week_day: friend.week_days[i]
                }
                for(let uTimes of userTimes){
                    if(uTimes.week_day !== fTimes.week_day){
                        continue;
                    }
                    const overlap = getTimeOverlap(uTimes, fTimes);
                    if(overlap){
                        newTimes.times.push({...overlap, week_day: uTimes.week_day});
                    }
                }
            }
            if(newTimes.times.length > 0){
                delete newTimes.week_days;
                delete newTimes.start_times;
                delete newTimes.end_times;
                matched.push(newTimes);
            }
        });

        res.send(matched);
    } catch(error) {
        res.sendStatus(500);
        console.log(error);
    }
});

module.exports = router;

