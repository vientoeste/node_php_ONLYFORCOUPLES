import sqlInit from 'serverless-mysql';
import * as dotenv from 'dotenv';

dotenv.config();
export const createConnection = () => {
    const mysql = sqlInit();
    mysql.config({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_ID,
        database: process.env.MYSQL_DB,
        password: process.env.MYSQL_PW,
        dateStrings: ['DATETIME'],
    });
    return mysql;
};
