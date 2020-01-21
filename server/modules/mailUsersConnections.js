const pool = require('./pool');
const sendEmail = require('./mailer');
const getUserAvailableMatches = require('./getUserAvailableMatches');

const BATCH_SIZE = 128;

// Email all users their weekly reccomendations
module.exports = async () => {
    let userRows;
    let offset = 0;
    const selectUsers = `
        SELECT * FROM "user"
        WHERE "status" = 0 AND "notifications" = 1
        ORDER BY "id"
        LIMIT $1
        OFFSET $2
    `
    // break up users into 128-user arrays so
    // node doesn't crash when there are a lot
    // of users.
    do {
        userRows = await pool.query(selectUsers, [BATCH_SIZE, offset]);
        userRows = userRows.rows;
        for(user of userRows){
            if(!user.email) continue;
            const available = getUserAvailableMatches(user.id, 5);
            sendEmail(user.email, JSON.stringify(available));
            console.log(JSON.stringify(available));
        }
        offset += BATCH_SIZE;
    } while (userRows.length === BATCH_SIZE);
}