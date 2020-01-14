const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    pool.query('SELECT * FROM "login" WHERE id = $1', [id])
        .then((result) => {
            const user = result && result.rows && result.rows[0];

            if(user){ 
                delete user.password;
                done(null, user);
            } else {
                done(null, null);
            }
        }).catch((error) => {
            console.log('Error with query during deserializing user ', error);
            done(error, null);
        });
});

passport.use('local', new LocalStrategy(async (username, password, done) => {
    try{
        const result = await pool.query('SELECT * FROM "login" WHERE username = $1', [username]);
        const user = result && result.rows && result.rows[0];
        if( !user ){
            done(null, null);
        } else {
            const passwordMatch = await encryptLib.comparePassword(password, user.password);
            if(user && passwordMatch){
                done(null, user);
            } else {
                done(null, null);
            }
        }
    } catch (error) {
        done(error, null);
    }
}));

module.exports = passport;