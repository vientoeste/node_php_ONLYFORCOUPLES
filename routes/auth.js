import * as express from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';

import { isLoggedIn, isNotLoggedIn } from '../utils/middlewares';
import { createConnection } from '../database';

const router = express.Router();

router.route('/login')
  .get(isNotLoggedIn, (req, res) => {
    res.render('login');
  })
  .post(async (req, res, next) => {
    const { username, password } = req.body;
    try{
      if (!username || !password) {
        throw new Error('there\'s no username or password on reqbody');
      }
      const mysql = createConnection();
      mysql.query(userInsertQuery, [username, password], (error, res) => {
        if (error.code === 'ER_DUP_ENTRY') {
          throw new Error('이미 존재하는 닉네임입니다.');
        }
        if (error) {
          throw new Error('회원가입 중 에러가 발생했습니다.');
        }
      });
      req.login(user, (error) => {
        if (error) {
          throw new Error('login error');
        } else {
          passport.authenticate('local')(req, res, () => {
            return res.redirect('/auth/login')
          });
        }
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

router.route('/logout')
  .get(isLoggedIn, (req, res, next) => {
    try {
      req.logout((error) => {
        req.session.destroy();
        if (error) {
          throw new Error('There\'s something wrong with logout process');
        }
        return res.redirect('/');
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

router.route('/register')
  .post(isNotLoggedIn, async (req, res, next) => {
    const userInsertQuery = `
    INSERT INTO user
    (username, password) VALUES (?, ?)`
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        throw new Error('There\'s no username or password on reqbody');
      }
      const userObj = await User.findOne({
        username: username,
      });
      if (!!userObj) {
        throw new Error('user already exists');
      }
      const salt = await bcrypt.genSalt(12);
      const hash = await bcrypt.hash(password, salt);
      const mysql = createConnection();
      await mysql.query(userInsertQuery, [username, hash], (err) => {
        if (err.code === 'ER_DUP_ENTRY') {
          throw new Error('이미 존재하는 닉네임입니다.');
        }
        if (err) {
          throw new Error('회원가입 중 에러가 발생했습니다.');
        }
        
      });
      req.login(user, (error) => {
        if (error) {
          throw new Error('login error');
        } else {
          passport.authenticate('local')(req, res, () => {
            req.session.username = username;
            return res.redirect('/');
          });
        }
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

router.route('/unregister')
  .get(isLoggedIn, async (req, res, next) => {
    const user = req.user.username;
    try {
      if (!user) {
        throw new Error('invalid username');
      }
      await Friend.deleteMany({
        $or: [{
          sender: user,
        }, {
          receiver: user,
        }],
      });
      await Room.deleteOne({
        owner: user,
      });
      await User.deleteOne({
        username: user,
      });
      await Chat.deleteMany({
        username: user,
      });
      await Flag.deleteMany({
        username: user,
      })
      req.session.destroy();
      res.redirect('/');
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

module.exports = router;