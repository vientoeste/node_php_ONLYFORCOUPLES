import sqlInit from 'serverless-mysql';
import dotenv from 'dotenv';
import { execSync } from 'child_process';
dotenv.config();

const mysql = sqlInit();

mysql.config({
  host: execSync('ipconfig.exe | grep IPv4 | cut -d: -f2 | grep -v \'192.168.0.*\'')
  .toString().split('\r\n').find((e) => e.trim().slice(-1) === '1')
  ?.trim(),
  user: process.env.MYSQL_ID,
  database: process.env.MYSQL_DB,
  password: process.env.MYSQL_PW,
  dateStrings: ['DATETIME'],
});
console.log(mysql.config())
export { mysql };
