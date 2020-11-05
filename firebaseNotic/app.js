
const admin = require("firebase-admin");
const foodmateConfig = require('./serviceAccountKey/foodmateConfig');
const isNull = require("lodash/isNull");
const dotenv = require('dotenv');
const { TaskIndexes } = require("../onLineState/models");

dotenv.config();

const servers = process.env.NATS_SERVER_HOSTS.split(',');
const stan = require("node-nats-streaming").connect("nats-streaming", "notificationService", {
  servers,
});

admin.initializeApp({
  credential: admin.credential.cert(foodmateConfig),
  databaseURL: "https://foodmate-b1f0f.firebaseio.com"
});

const messagingInstance = admin.messaging();
const CHANNEL_ID = 'SEND_NOTIFICATION';

stan.on('connect', function() {
  const getIndexItem = (item = null) => {
    if (isNull(item)) {
      const indexItem = new TaskIndexes({ id: CHANNEL_ID, sequence: 0 });
      indexItem.save();
      return indexItem;
    }
    return item;
  };
  TaskIndexes.find({}, (error, items) => {
  console.log('stan.on -> items', items)
    
  })
  TaskIndexes.findOne({ where: { id: CHANNEL_ID } }, (error, item) => {
    const indexItem = getIndexItem(item);
    console.log('stan.on -> indexItem', indexItem)

    const opts = stan.subscriptionOptions().setDeliverAllAvailable();
    opts.setManualAckMode(true);
    opts.setAckWait(60 * 1000); // 60s
    opts.setStartAtSequence(indexItem.sequence + 1);

    const subscription = stan.subscribe(CHANNEL_ID, `${CHANNEL_ID}.workers`, opts);
    
    subscription.on("message", async function (msg) {
      try {
        console.log('msg.getSequence()', msg.getSequence())
        const item = JSON.parse(msg.getData());
        await messagingInstance.send(item);
        indexItem.sequence = msg.getSequence();
        indexItem.save();
        console.log('indexItem', indexItem)
        msg.ack();
        console.log('msg.ack')
      } catch(error) {

      }
    });
  });
});



// console.log(admin.name);

// admin.messaging().send({
//   token: "dZNDj2oP8EyvgHqPvGd_L4:APA91bGkWlVXXsyQ3lc8HU26Te91NgR_UMjsA7sVn7aiZ3adzH-5M2IvNqmoYA442ikPOxUtDNO0ktsB7Cd_r7Sj1TzOoYThtjl-GM8_OCRbymez3cNFOUa5kxsPtEAxUdPFtgZYQpYA",
//   notification: {
//     title: 'test title111',
//     body: 'test body222'
//   }
// }).then(resp => {
// console.log('resp', resp)
  
// }).catch(error => {
// console.log('error', error)
  
// })