import express from 'express';
import { spawn } from 'child_process';
import { isLoggedIn, isNotLoggedIn } from '../utils/middlewares.js';
import { mysql } from '../database/index.js';
import path from 'path';

export const diaryRouter = express.Router();
const controllerPath = `./controller/${path.basename(import.meta.url).slice(0, -3)}`;

diaryRouter.get('/', isLoggedIn, (req, res) => {
  const phpProcess = spawn(
    'php', [`${controllerPath}/index.php`,
    process.env.MYSQL_HOST,
    process.env.MYSQL_ID,
    process.env.MYSQL_PW,
    process.env.MYSQL_DB]
  );
  phpProcess.stdout.on('data', (data) => {
    res.send(data.toString());
  });
});

diaryRouter.post('/', isLoggedIn, (req, res, next) => {
  const username = req.session.username;
  const { category, contents } = req.body;
  try {
    if (!username) {
      throw new Error('No User In Session');
    }
    if (!category || !contents) {
      throw new Error('Req Body Required');
    }
    const phpProcess = spawn(
      'php', [`${controllerPath}/setter.php`,
      process.env.MYSQL_HOST,
      process.env.MYSQL_ID,
      process.env.MYSQL_PW,
      process.env.MYSQL_DB,
      username, category, contents]
    );
    phpProcess.stdout.on('data', (resCode) => {
      switch (resCode) {
        case 1:
          res.send('ok');
        case 11:
          res.send('insert failed');
      }
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

diaryRouter.get('/:id', isLoggedIn, (req, res, next) => {
  // [TODO] :id 존재 여부 체크 필요, php 프로세스 내 쿼리로 해결하도록..
  const userId = req.params.id;
  try {
    const { username } = req.session;
    if (!username) {
      throw new Error('No User In Session');
    }
    const phpProcess = spawn(
      'php', [`${controllerPath}/getter.php`,
      process.env.MYSQL_HOST,
      process.env.MYSQL_ID,
      process.env.MYSQL_PW,
      process.env.MYSQL_DB,
      username, "userId", userId]
    );
    phpProcess.stdout.on('data', (data) => {
      // [TODO] Array 형태 결과 출력(print_r)을 위해 data.js에서 데이터 리폼 필요
      res.send(data);
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

diaryRouter.get('/category/:categoryId', isLoggedIn, (req, res, next) => {
  const categoryId = req.params.categoryId;
  try {
    const { username } = req.session;
    if (!username) {
      throw new Error('No User In Session');
    }
    const phpProcess = spawn(
      'php', [`${controllerPath}/getter.php`,
      process.env.MYSQL_HOST,
      process.env.MYSQL_ID,
      process.env.MYSQL_PW,
      process.env.MYSQL_DB,
      username, "category", categoryId]
    );
    phpProcess.stdout.on('data', (data) => {
      // [TODO] Array 형태 결과 출력(print_r)을 위해 data.js에서 데이터 리폼 필요
      res.send(data);
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

diaryRouter.get('/date', isLoggedIn, (req, res, next) => {
  const { minDate, maxDate } = req.query;
  try {
    if (!minDate) {
      throw new Error('Set date to search data');
    }
    const { username } = req.session;
    if (!username) {
      throw new Error('No User In Session');
    }
    const phpProcess = spawn(
      'php', [`${controllerPath}/getter.php`,
      process.env.MYSQL_HOST,
      process.env.MYSQL_ID,
      process.env.MYSQL_PW,
      process.env.MYSQL_DB,
      username, "date", minDate, maxDate]
    );
    phpProcess.stdout.on('data', (data) => {
      // [TODO] Array 형태 결과 출력(print_r)을 위해 data.js에서 데이터 리폼 필요
      res.send(data);
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});
