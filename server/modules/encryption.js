const bcrypt = require('bcrypt');

const SALT_WORK_FACTOR = 10;

const encryptPassword = async (password) => {
    const hashed = await bcrypt.hash(password, SALT_WORK_FACTOR);
    return hashed;
}

const comparePassword = async (candidatePassword, storedPassword) => {
    const compare = await bcrypt.compare(candidatePassword, storedPassword);
    return compare;
}

module.exports = { comparePassword, encryptPassword }