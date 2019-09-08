const remove = require('lodash/remove');
class roomClass {
  constructor(params) {

    this._MAX = 8;
    this._ID = params.id;
    this._MEMBERS = [];

  }

  get id() {
    return this._ID;
  }

  addMember(user) {
    return new Promise((resolve, reject) => {
      let error = null;
      this._MEMBERS.map(u => {
        if (u.id === user.id) {
          reject(new Error('使用者已存在'));
        }
      });
      this._MEMBERS.push(user);

      resolve();
    });
  }

  removeMember(user) {
    let error = null;

    return remove(this._MEMBERS, (member) => {
      return member.id === user.id;
    });
  }
}

module.exports = roomClass;
