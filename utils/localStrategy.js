import { use } from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { compare } from 'bcrypt'
import { createConnection } from '../database';

export const localStrategy = () => {
  use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
  }, async (username, password, done) => {
    const mysql = createConnection();
    try {
      const user = await mysql.query('SELECT * FROM user WHERE username=?', [username])
      if (!user || user.length === 0) {
        done(null, false, {
          message: '미가입 회원입니다.'
        });
      }
      const isAuthenticated = await compare(`${password}`, `${user[0].password}`);
      if (isAuthenticated) {
        done(null, user);
      }
      done(null, false, {
        message: '비밀번호가 일치하지 않습니다.'
      });
    } catch (err) {
      console.error(err);
      done(err);
    } finally {
      await mysql.end();
    }
  }));
};
