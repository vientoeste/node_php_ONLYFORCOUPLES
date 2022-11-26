import { createConnection } from '../database';

const passport = require('passport');
const localStrategy = require('./localStrategy');

export const passportConfig = () => {
  passport.serializeUser((user, done) => {
    done(null, user.username);
  });
  passport.deserializeUser((username, done) => {
    const mysql = createConnection();
    mysql.query(`SELECT username, password FROM user WHERE username=?`, [username]).then((queryRes) => {
      done(null, queryRes[0].username);
    });
  });
  localStrategy();
}
