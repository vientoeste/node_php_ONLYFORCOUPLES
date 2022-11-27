import express from 'express';
import { spawn } from 'child_process';
import { isLoggedIn, isNotLoggedIn } from '../utils/middlewares.js';
import { mysql } from '../database/index.js';

export const messageRouter = express.Router();

messageRouter.get('/', (req, res) => {
    const phpProcess = spawn(
        'php', ["./ex.php",
        process.env.MYSQL_HOST,
        process.env.MYSQL_ID,
        process.env.MYSQL_PW,
        process.env.MYSQL_DB]
    );
    phpProcess.stdout.on('data', (data) => {
      res.send(data.toString());
    });
});
