const SQL = require('sql-template-strings');
const query = require('./mysqlConnectionPool');

const getTotalCount = () => {
  const sql = SQL`
    SELECT COUNT(1) AS count
    FROM test`;

  return query(sql);
};

const memberQueries = {
  getTotalCount
};

module.exports = memberQueries;
