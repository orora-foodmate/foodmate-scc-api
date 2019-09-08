const mysql = require('promise-mysql');
const dotenv = require('dotenv');

const config = dotenv.config().parsed;

const connections = mysql.createPool({
  connectionLimit     : 3,
  host     				    : config.MYSQL_HOST,
  user     				    : config.MYSQL_USER,
  port                : config.MYSQL_PORT,
  password 				    : config.MYSQL_PASSWORD,
  database 				    : config.MYSQL_DATABASE,
  timezone				    : 'utc',
});

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