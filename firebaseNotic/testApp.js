const isEmpty = require("lodash/isEmpty");
const dotenv = require('dotenv');
const { TaskIndexes } = require("../onLineState/models");

dotenv.config();

const servers = process.env.NATS_SERVER_HOSTS.split(',');
const stan = require("node-nats-streaming").connect("nats-streaming", "test1", {
  servers,
});

const CHANNEL_ID = 'SEND_NOTIFICATION';

stan.on('connect', function() {
  const item = {
    token: "dZNDj2oP8EyvgHqPvGd_L4:APA91bGkWlVXXsyQ3lc8HU26Te91NgR_UMjsA7sVn7aiZ3adzH-5M2IvNqmoYA442ikPOxUtDNO0ktsB7Cd_r7Sj1TzOoYThtjl-GM8_OCRbymez3cNFOUa5kxsPtEAxUdPFtgZYQpYA",
    notification: {
      title: 'test title222',
      body: 'test body333'
    }
  };
  stan.publish(CHANNEL_ID, JSON.stringify(item), (err, guid) => {
    if (err) {
      console.log("publish failed: " + err);
    } else {
      console.log("published message with guid: " + guid);
    }
    process.exit(0);
  });
});
