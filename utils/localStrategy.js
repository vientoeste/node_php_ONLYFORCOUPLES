import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import * as bcrypt from 'bcrypt'
import { mysql } from '../database/index.js';


export const localStrategy = () => {
  passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
  }, async (username, password, done) => {
    try {
      const user = await mysql.query('SELECT username, password FROM user WHERE username=?', [username]).then((queryRes) => {
        return {
          username: queryRes[0].username,
          password: queryRes[0].password,
        };
      });
      if (!user || user.length === 0) {
        done(null, false, {
          message: '미가입 회원입니다.'
        });
      }
      if (user.length !== 1) {
        done(null, false, {
          message: 'Internal server error'
        });
      }
      const isAuthenticated = await bcrypt.compare(`${password}`, `${user.password}`);
      if (!isAuthenticated) {
        done(null, false, {
          message: '비밀번호가 일치하지 않습니다.'
        });
      }
      if (isAuthenticated) {
        done(null, {
          username: user.username,
          password: user.password
        });
      }
    } catch (err) {
      console.error(err);
      done(err);
    }
  }));
};
