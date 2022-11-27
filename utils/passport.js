import { mysql } from '../database/index.js';
import passport from 'passport';
import { localStrategy } from './localStrategy.js';

export const passportConfig = () => {
  passport.serializeUser((user, done) => {
    done(null, user.username);
  });
  passport.deserializeUser((username, done) => {
    mysql.query(`SELECT username, password FROM user WHERE username=?`, [username]).then((queryRes) => {
      const user = { username: queryRes[0].username, password: queryRes[0].password }
      done(null, user);
    });
  });
  localStrategy();
}
