const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const router = require('express').Router();
const pool = require('../modules/pool');
const getUserAvailableMatches = require('../modules/getUserAvailableMatches');

router.get('/', rejectUnauthenticated, async (req, res) => {
    try{
        const matched = await getUserAvailableMatches(req.user.user_id);
        res.send(matched);
    } catch(error) {
        res.sendStatus(500);
        console.log(error);
    }
});

module.exports = router;

