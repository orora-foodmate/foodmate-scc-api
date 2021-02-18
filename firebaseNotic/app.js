
const admin = require("firebase-admin");
const foodmateConfig = require('./serviceAccountKey/foodmateConfig');

admin.initializeApp({
  credential: admin.credential.cert(foodmateConfig),
  databaseURL: "https://foodmate-b1f0f.firebaseio.com"
});

