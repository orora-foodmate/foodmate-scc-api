# Socket Event

## get rooms by users

eventName: `getRooms`

body:

roomId: room object id

startDateTime: 2020-09-11 17:55:33

response:

```json
{
  "success": true,
  "data": [
    {
  "_id": "mongoID",
  "roomId": "roomId",
  "dateString": "2020-09-28",
  "createAt": "date",
  "updateAt": "date",
  "messages": [{
    "sender": "userId",
    "content": "string",
    "createAt": "date",
    "updateAt": "date",
  }]
}
  ]
}
```