module.exports = (a, b) => {
    if(a.start_time >= b.start_time && a.end_time <= b.end_time){
        return {
            start_time: a.start_time,
            end_time: a.end_time
        }
    } else if (b.start_time >= a.start_time && b.end_time <= a.end_time){
        return {
            start_time: b.start_time,
            end_time: b.end_time
        };
    } else if(b.start_time < a.start_time && a.start_time < b.end_time){
        return {
            start_time: a.start_time,
            end_time: b.end_time
        };
    } else if(b.start_time < a.end_time && a.end_time < b.end_time){
        return {
            start_time: b.start_time,
            end_time: a.end_time
        }
    }
    return null;
}