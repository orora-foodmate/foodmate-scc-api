# Users

```javascript
const user = {
  _id: mongoID,
  name: string,
  avatar: string,
  hash_password: string,
  account: string,
  createAt: date,
  updateAt: date,
}
```

# Rooms

```javascript
const room = {
  _id: mongoID,
  name: string,
  users: [mongoID],
  creator: mongoID,
  createAt: date,
  updateAt: date,
  status: number, // enums: [0: 未啟用, 1: 啟用, 2: 凍結, 3: 刪除]
  type: number, // enums: [0: friend, 1: group]
}
```

# FriendMappings

```javascript
const friend = {
  users: [],
  creator: userId,
  createAt: date,
  updateAt: date,
  status: number, // enums: [0: 陌生人, 1: 審核中, 2: 已經是好友]
}
```

# Messages

```javascript
const message = {
  _id: mongoID,
  roomId: roomId,
  dateString: "2020-09-28",
  createAt: date,
  updateAt: date,
  messages: [{
    sender: userId,
    content: string,
    createAt: date,
    updateAt: date,
  }]
}
```
