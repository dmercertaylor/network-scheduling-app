const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const sendMailTo = require('../modules/mailer');
const router = require('express').Router();
var CronJob = require('cron').CronJob;

router.post('/', rejectUnauthenticated, (req, res) => {
    console.log(new Date(req.body.date));
    const job = new CronJob(new Date(req.body.date), function() {
        sendMailTo(req.body.email, req.body.message);
        this.stop();
    }, null, true, 'America/Chicago');
    console.log(job);
    res.sendStatus(200);
});

module.exports = router;