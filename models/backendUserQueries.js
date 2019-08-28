const SQL = require('sql-template-strings');
const query = require('./mysqlConnectionPool');
const isEmpty = require('lodash/isEmpty');

module.exports.createBackendUser = ({
  employee,
  password,
  stat,
  actid,
  optor
}) => {
  const sql = SQL`
    INSERT INTO admin_emp 
    (
      empname,
      lpwd,
      actid,
      stat,
      optor
    ) VALUES (
      ${employee},
      ${password},
      ${actid},
      ${stat},
      ${optor}
    )
  `;

  return query(sql);
};

module.exports.getBackendUserById = id => {
  const sql = SQL`
    SELECT
      id,
      empname as employee,
      actid,
      stat,
      cdt
    FROM admin_emp
    WHERE id=${id}
  `;

  return query(sql);
};

module.exports.getBackendUserByName = (name, withPasswordField = false) => {
  const sql = SQL`
    SELECT
      id,
      empname as employee,
      lpwd as password,
      actid,
      stat,
      cdt
    FROM admin_emp
    WHERE empname=${name}
  `;

  return query(sql).then(users => {
    const [user = null] = users;
    if (isEmpty(user)) return null;
    return withPasswordField
      ? user
      : {
          ...user,
          password: undefined
        };
  });
};

// just for unitest
module.exports.removeBackendUserByNames = names => {
  const sql = SQL`
    DELETE FROM
      admin_emp
    WHERE
      empname IN (${names})
  `;

  return query(sql);
};
