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
            const plainText = getPlainText(user, available);
            console.log(JSON.stringify(plainText));
            sendEmail(user.email, plainText);
        }
        offset += BATCH_SIZE;
    } while (userRows.length === BATCH_SIZE);
}

function getPlainText(user, available){
    available = available.map(friend => {
        let dayStrings = [];
        for(let i=0; i<7; i++) dayStrings.push(undefined);
        
        friend.times.forEach(({start_time, end_time, week_day}) => {
            if(dayStrings[week_day]) dayStrings[week_day].push({
                start_time: formatTime(start_time),
                end_time: formatTime(end_time)
            });
            else dayStrings[week_day] = [{
                start_time: formatTime(start_time),
                end_time: formatTime(end_time)
            }];
        });

        dayStrings = dayStrings.map((times, dayIndex) => {
            if(!times) return undefined;
            const timeStr = [`${days[dayIndex]} from ${times[0].start_time} to ${times[0].end_time}`];
            for(var i = 1; i < times.length - 1; i++ ){
                timeStr.push(`, ${times[i].start_time} to ${times[i].end_time}`);
            }
            if(timeStr.length > 1){
                timeStr.push(`and ${times[i].start_time} to ${times[i].end_time}`);
            }
            return timeStr.join('');
        });

        return (
            `${friend.full_name} is free ${dayStrings.filter(a => !!a).join(', ')}.`
        );
    });
    
    return (
        `Hello, ${user.full_name}\n` +
        `We believe the following ${available.length > 1 ? 'connections are ' : 'connection is '}` +
        `available at similar times to you:\n\t${available.join('\n\t')}`
    );
}