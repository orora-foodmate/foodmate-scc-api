const mysql = require('promise-mysql');

const config = process.env;

const connections = mysql.createPool({
  connectionLimit     : 3,
  host     				    : config.MYSQL_HOST,
  user     				    : config.MYSQL_USER,
  port                : config.MYSQL_PORT,
  password 				    : config.MYSQL_PASSWORD,
  database 				    : config.MYSQL_DATABASE,
  timezone				    : 'utc',
});

module.exports =  (sql) => connections.then(connection => connection.query(sql));