export default time => {
    time = time.split(':', 2);
    time[0] = Number(time[0]);
    return time.join(':');
}