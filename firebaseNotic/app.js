const admin = require("firebase-admin");
const foodmateConfig = require("./serviceAccountKey/foodmateConfig");
const serviceAccount = require('./serviceAccountKey/foodmate-d602a-firebase-adminsdk-py14o-f73858b938.json');
console.log("serviceAccount", serviceAccount)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://foodmate-d602a.firebaseio.com"
});

console.log(admin.name);

// admin.messaging().send({
//   token: "d7wM62CR0UNzqY69mWaNDM:APA91bEHA5UIvgq-CvZx8o2K4BoC1c2ZJlHno6l6nEt1fJsTTCl-0_hvlYHEpcWma57zJDL01F-1UWmKZrhXBEo-GE8kwPz9YhaXYjiZORsntSlqj9NbhjqJzGslJ0Msvua2kWEFuvYO",
//   notification: {
//     title: 'test title',
//     body: 'test body'
//   }
// }).then(resp => {
// console.log('resp', resp)
  
// }).catch(error => {
// console.log('error', error)
  
// })