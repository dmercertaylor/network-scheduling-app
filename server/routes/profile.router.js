const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();
const s3 = require('../modules/s3');

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
        if(req.body.length){
            const values = req.body.map((time, i) => {
                config.push(time.week_day, time.start_time, time.end_time);
                return `($1, $${i*3+2}, $${i*3+3}, $${i*3+4})`;
            }).join(', ');
            const insertQuery = `
                INSERT INTO "weekly_availability" ("user_id", "week_day", "start_time", "end_time")
                VALUES ${values}`
            await pool.query(insertQuery, config);
        }
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
        console.log(error);
    }
});

router.put('/', rejectUnauthenticated, async (req, res) => {
    try{
        const acceptedKeys = ['full_name', 'company', 'location', 'avatar_url', 'email', 'status', 'preferred_contact', 'notifications'];
        const config = [];

        const sets = Object.keys(req.body).filter(key => acceptedKeys.includes(key)).map((key, i) => {
            config.push(req.body[key]);
            return `${key}=$${i+1}`
        }).join(', ');

        if(config.length > 0){
            const query = `
                UPDATE "user" SET ${sets}
                WHERE "id"=$${config.length + 1}`;
            config.push(req.user.user_id);
            await pool.query(query, config);

            if(req.body.avatar){
                const fileType = req.body.avatar.substring("data:image/".length, req.body.avatar.indexOf(";base64"));
                const base64Data = new Buffer.from(req.body.avatar.replace(/^data:image\/\w+;base64,/, ""), 'base64');
        
                const params = {
                    Bucket: process.env.S3_BUCKET_NAME,
                    Key: `avatars/${req.user.user_id}.${fileType}`, // File name you want to save as in S3
                    Body: base64Data,
                    ContentEncoding: 'base64',
                    ContentType: `image/${fileType}`
                };
        
                await s3.upload(params).promise();
            }
            res.sendStatus(200);
        }
        else {
            res.sendStatus(200);
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

module.exports = router;