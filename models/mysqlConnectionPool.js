const mysql = require('promise-mysql');

const config = process.env;

const connections = mysql.createPool({
  connectionLimit: 10,
  queueLimit: 15000,
  queued: 10000,
  getConnection: 0,
  host: config.MYSQL_HOST,
  user: config.MYSQL_USER,
  port: config.MYSQL_PORT,
  password: config.MYSQL_PASSWORD,
  database: config.MYSQL_DATABASE,
  timezone: 'utc'
});

module.exports.query = async sql => {
  const connection = await pool.getConnection();
  try {
    const result = await connection.query(sql);
    connection.commit();
    connection.release();
    return result;
  } catch (error) {
    connection.rollback();
    connection.release();
    throw error;
  }
};
