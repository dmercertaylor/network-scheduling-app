const pool = require('./pool');
const sendEmail = require('./mailer');
const getUserAvailableMatches = require('./getUserAvailableMatches');
const days = require('./days');

const BATCH_SIZE = 128;

const formatTime = time => {
    time = time.split(':', 2);
    time[0] = Number(time[0]);
    return time.join(':');
}


// Email all users their weekly reccomendations
module.exports = async function(){
    console.log('firing');
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
        console.log(days)
        userRows = await pool.query(selectUsers, [BATCH_SIZE, offset]);
        userRows = userRows.rows;
        for(user of userRows){
            if(!user.email) continue;
            let available = await getUserAvailableMatches(user.id, 5);
            if(available.length === 0) continue;

            available = available.map(friend => {
                let dayStrings = [];
                for(let i=0; i<7; i++) dayStrings.push(undefined);
                
                friend.times.forEach(({start_time, end_time, week_day}) => {
                    if(dayStrings[week_day]){
                        dayStrings[week_day] += `, ${formatTime(start_time)} to ${formatTime(end_time)}`;
                    } else {
                        dayStrings[week_day] = `${days[week_day]}, from ${formatTime(start_time)} to ${formatTime(end_time)}`;
                    }
                });
                dayStrings = dayStrings.filter(a => !!a).map(str => {
                    const lastComma = str.lastIndexOf(',');
                    if(lastComma === str.indexOf(',')) return str;
                    return str.substring(0, lastComma) + 'and' + str.substring(lastComma + 1);
                })
                return (
                    `${friend.full_name} is free :\n\t${dayStrings.join('\n\t')}\n\n`
                );
            });
            
            const textToSend = (
                `Hello, ${user.full_name}\n` +
                `We found ${available.length > 1 ? 'these connections are ' : 'this connection is '}` +
                `available at similar times to you:\n\n${available.join('\n\n')}`
            )
            console.log(textToSend);
            sendEmail(user.email, textToSend);
        }
        offset += BATCH_SIZE;
    } while (userRows.length === BATCH_SIZE);
}