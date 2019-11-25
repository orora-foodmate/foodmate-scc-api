const mysql = require('promise-mysql');
const dotenv = require('dotenv');

const config = dotenv.config().parsed;

let pool = null;

module.exports.initialMySQLPool = async () => {
  try {
    pool = await mysql.createPool({
      connectionLimit: 10,
      queueLimit : 15000,
      queued: 10000,
      getConnection: 0,
      host: config.MYSQL_HOST,
      user: config.MYSQL_USER,
      port: config.MYSQL_PORT,
      password: config.MYSQL_PASSWORD,
      database: config.MYSQL_DATABASE,
      timezone: 'utc'
    });
  } catch (error) {
    throw error;
  }
};

module.exports.query = async sql => {
  const connection = await pool.getConnection();
  try {
    const result = await connection.query(sql);
    connection.release();
    return result;
  } catch (error) {
    connection.release();
    throw error;
  }
};