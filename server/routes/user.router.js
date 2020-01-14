const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');
const s3 = require('../modules/s3');
const router = express.Router();

router.get('/', rejectUnauthenticated, (req, res) => {
    res.send(req.user);
});

router.post('/register', async (req, res, next) => {
    try {
        const form = req.body;
        const password = await encryptLib.encryptPassword(req.body.password);

        let query = `
            INSERT INTO "user" (full_name, company, location, email)
            VALUES ($1, $2, $3, $4) RETURNING id
        `;
        const idRows = await pool.query(query, [form.name, form.company, form.location, form.email]);
        query = `
            INSERT INTO "login" ("username", "password", "user_id")
            VALUES ($1, $2, $3)
        `
        await pool.query(query, [form.username, password, idRows.rows[0].id]);


        if(req.body.avatar){
            const fileType = req.body.avatar.substring("data:image/".length, req.body.avatar.indexOf(";base64"));
            const base64Data = new Buffer.from(req.body.avatar.replace(/^data:image\/\w+;base64,/, ""), 'base64');

            const params = {
                Bucket: process.env.BUCKET_NAME,
                Key: `avatars/${idRows.rows[0].id}.${fileType}`, // File name you want to save as in S3
                Body: base64Data,
                ContentEncoding: 'base64',
                ContentType: `image/${fileType}`
            };
            
            const uploaded = await s3.upload(params).promise();

            query = 'UPDATE "user" SET "avatar_url"=$1 WHERE "id" = $2';
            pool.query(query, [uploaded.Location, idRows.rows[0].id]).
                then(results => {
                    res.sendStatus(200);
                });
        } else {
            res.sendStatus(200);
        }
    } catch (error) {
        res.sendStatus(500);
        console.log(error);
    }
});

router.post('/login', userStrategy.authenticate('local'), (req, res) => {
    res.sendStatus(200);
});

router.post('/logout', (req, res) => {
    req.logout();
    res.sendStatus(200);
});

module.exports = router;