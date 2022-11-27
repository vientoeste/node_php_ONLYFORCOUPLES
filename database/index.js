import sqlInit from 'serverless-mysql';
import dotenv from 'dotenv';
dotenv.config();

const mysql = sqlInit();

mysql.config({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_ID,
  database: process.env.MYSQL_DB,
  password: process.env.MYSQL_PW,
  dateStrings: ['DATETIME'],
});
console.log(mysql.config())
export { mysql };
