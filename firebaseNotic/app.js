
const admin = require("firebase-admin");
const foodmateConfig = require('./serviceAccountKey/foodmateConfig');
const isNull = require("lodash/isNull");
const { TaskIndexes } = require("../onLineState/models");

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

stan.on('connect', function () {
  const getIndexItem = (item = null) => {
    if (isNull(item)) {
      const indexItem = new TaskIndexes({ id: CHANNEL_ID, sequence: 0 });
      indexItem.save();
      return indexItem;
    }
    return item;
  };

  TaskIndexes.findOne({ where: { id: CHANNEL_ID } }, (error, item) => {
    const indexItem = getIndexItem(item);

    const opts = stan.subscriptionOptions().setDeliverAllAvailable();
    opts.setManualAckMode(true);
    opts.setAckWait(60 * 1000); // 60s
    opts.setStartAtSequence(indexItem.sequence + 1);

    const subscription = stan.subscribe(CHANNEL_ID, `${CHANNEL_ID}.workers`, opts);

    subscription.on("message", async function (msg) {
      try {
        const item = JSON.parse(msg.getData());
        if(item.notification) {
          await messagingInstance.send(item); 
        }
        
        indexItem.sequence = msg.getSequence();
        indexItem.save();
        msg.ack();
      } catch (error) {
      }
    });
  });
});

const publishMessage = (message) => {
  return new Promise((resolve, reject) => {
    stan.publish(CHANNEL_ID, JSON.stringify(message), (err, guid) => {
      if (err) {
        reject(err);
      } else {
        resolve(guid);
      }
    });
  })
}

module.exports.publishMessage = publishMessage;