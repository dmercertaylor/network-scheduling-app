const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');
const router = express.Router();

router.get('/', rejectUnauthenticated, async (req, res) => {
    try{
        const profile = await pool.query('SELECT * FROM "user" WHERE "id"=$1', [req.user.user_id]);
        const times = await pool.query('SELECT "week_day", "start_time", "end_time" FROM "weekly_availability" WHERE "user_id"=$1', [req.user.user_id]);
        res.send({...profile.rows[0], timesAvailable: times.rows});
    }catch(error){
        res.sendStatus(500);
        console.log(error);
    }
});

router.put('/updateTimes', rejectUnauthenticated, async (req, res) => {
    try {
        const deleteQuery = `DELETE FROM "weekly_availability" WHERE "user_id"=$1`;
        await pool.query(deleteQuery, [req.user.user_id]);
        const config = [req.user.user_id];
        // map values, pushing values to config and adding
        // appropriate macros to the "values" string
        const values = req.body.map((time, i) => {
            config.push(time.week_day, time.start_time, time.end_time);
            return `($1, $${i*3+2}, $${i*3+3}, $${i*3+4})`;
        }).join(', ');
        console.log(config);
        console.log(values);
        const insertQuery = `
            INSERT INTO "weekly_availability" ("user_id", "week_day", "start_time", "end_time")
            VALUES ${values}
        `
        await pool.query(insertQuery, config);
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
        console.log(error);
    }
})

router.put('/', rejectUnauthenticated, (req, res) => {
    const acceptedKeys = ['full_name', 'company', 'location', 'avatar_url', 'email', 'status'];
    const config = [];
    const sets = Object.keys(req.body).filter(key => acceptedKeys.includes(key)).map((key, i) => {
        config.push(req.body[key]);
        return `${key}=$${i+1}`
    }).join(', ');
    if(config.length > 0){
        const query = `UPDATE "user" SET ${sets} WHERE "id"=$${config.length + 1}`;
        config.push(req.user.user_id);
        pool.query(query, config).then(results => {
            res.sendStatus(200);
        }).catch(error => {
            console.log(error);
            res.sendStatus(500);
        });
    }
    else {
        res.sendStatus(200);
    }
});

module.exports = router;