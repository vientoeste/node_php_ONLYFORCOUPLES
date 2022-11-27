import express from 'express';
import * as dotenv from 'dotenv';
import { spawn } from 'child_process';
import session from 'express-session';
import passport from 'passport';
import nunjucks from 'nunjucks';
import morgan from 'morgan';
import path from 'path';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';

import { passportConfig } from './utils/passport.js';
import { isLoggedIn } from './utils/middlewares.js';
import { authRouter } from './routes/auth.js';
import { messageRouter } from './routes/message.js';
import { bucketlistRouter } from './routes/bucketlist.js';
import { calenderRouter } from './routes/calender.js';
import { diaryRouter } from './routes/diary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
passportConfig();

app.set('view engine', 'njk');

nunjucks.configure('views', {
  express: app,
  watch: true,
});
const sessionMiddleware = session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
});

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'views')));
app.use('/views', express.static(path.join(__dirname + 'views')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);
app.use('/diary', diaryRouter);
app.use('/calender', calenderRouter);
app.use('/bucketlist', bucketlistRouter);
app.use('/message', messageRouter);

app.get('/', (req, res, next) => {
  res.send('ok');
});

app.get('/exampleRouter', (req, res) => {
  const phpProcess = spawn('php', ["./ex.php", process.env.MYSQL_HOST, process.env.MYSQL_ID, process.env.MYSQL_PW, process.env.MYSQL_DB]);
  phpProcess.stdout.on('data', (data) => {
    res.send(data.toString());
  });
});

app.listen(3001);