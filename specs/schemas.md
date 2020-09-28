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
  createAt: date,
  updateAt: date,
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
