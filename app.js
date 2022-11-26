import * as express from 'express';
import { spawn } from 'child_process';
import { config } from 'dotenv';
import session from 'express-session';
import passport from 'passport';

config();

import { router as authRouter } from '../routes/auth.js';

const app = express.default();
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
app.use(express.static(path.join(__dirname, 'views')))
app.use('/views', express.static(path.join(__dirname + 'views')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);

app.get('/exampleRouter', (req, res) => {
    const process = spawn('php', ["./ex.php", req.query.query]);
    process.stdout.on('data', (data) => {
        res.send(data.toString());
    });
});

app.listen(3001);