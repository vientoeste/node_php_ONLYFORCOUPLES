import express from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';

import { isLoggedIn, isNotLoggedIn } from '../utils/middlewares.js';
import { mysql } from '../database/index.js';

export const authRouter = express.Router();

authRouter.route('/login')
  .get((req, res) => {
    res.render('login');
  });
authRouter.post('/login', passport.authenticate('local', {
  failWithError: true,
  failureMessage: true,
}), async (req, res, next) => {
  const { username, password } = req.body;
  try {
    req.login({
      username: username,
      password: password,
    }, (error) => {
      console.log(23);
      if (error) {
        console.error(error)
        throw new Error('login error');
      };
    });
    console.log(35)
    console.log(req.user)
  } catch (err) {
    next(err);
  }
  res.send('ok')
  return;
});

authRouter.route('/logout')
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

authRouter.route('/register')
  .post(isNotLoggedIn, async (req, res, next) => {
    await mysql.connect();
    const userInsertQuery = `
    INSERT INTO onc.user
    (username, password) VALUES (?, ?)`;
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        throw new Error('There\'s no username or password on reqbody');
      }
      const salt = await bcrypt.genSalt(12);
      const hash = await bcrypt.hash(password, salt);
      await mysql.query(userInsertQuery, [username, hash])
      const user = { username: username, password: hash}
      console.log('76')
      req.login(user, (error) => {
        if (error) {
          throw new Error('login error');
        } else {
          passport.authenticate('local')(req, res, () => {
            req.session.username = username;
          });
        }
      });
      return res.redirect('/');
    } catch (err) {
    if (err?.code === 'ER_DUP_ENTRY') {
      console.log('132');
    }
      console.error(err);
      next(err);
    } finally {
      await mysql.end();
    }
  });

authRouter.route('/unregister')
  .get(isLoggedIn, async (req, res, next) => {
    await mysql.connect();
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
