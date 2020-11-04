const admin = require("firebase-admin");
const foodmateConfig = require("./serviceAccountKey/foodmateConfig");

console.log('admin.credential.applicationDefault()', admin.credential.applicationDefault())
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  ...foodmateConfig,
});

admin.messaging().send({
  token: "dZNDj2oP8EyvgHqPvGd_L4:APA91bGkWlVXXsyQ3lc8HU26Te91NgR_UMjsA7sVn7aiZ3adzH-5M2IvNqmoYA442ikPOxUtDNO0ktsB7Cd_r7Sj1TzOoYThtjl-GM8_OCRbymez3cNFOUa5kxsPtEAxUdPFtgZYQpYA",
  notification: {
    title: 'test title',
    body: 'test body'
  }
}).then(resp => {
console.log('resp', resp)
  
}).catch(error => {
console.log('error', error)
  
})