"use-strict";
const servers = [
  "nats://127.0.0.1:14222",
  "nats://127.0.0.1:24222",
  "nats://127.0.0.1:34222",
];

// Randomly connect to a server in the cluster group.
// Note that because `url` is not specified, the default connection is called first
// (nats://localhost:4222). If you don't want default connection, specify one of
// the above the above servers as `url`: `nats.connect(servers[0], {'servers': servers});`
// let nc = NATS.connect({ servers: servers, json: true });

// currentServer is the URL of the connected server.
// nc.on("connect", () => {
//   console.log("Connected to " + nc.currentServer.url.host);
//   nc.subscribe('updates', {queue: "workers"}, (msg) => {
//     console.log('worker got message', msg);
// });
// });

const stan = require('node-nats-streaming').connect('nats-streaming', 'test1', { servers });

stan.on('connect', function () {

  stan.publish("foo", "Hello node-nats-streaming!", (err, guid) => {
    if (err) {
      console.log("publish failed: " + err);
    } else {
      console.log("published message with guid: " + guid);
    }
  });
  
  // const opts = stan.subscriptionOptions().setDeliverAllAvailable();
  // const timeUsSubscription = stan.subscribe('time.us', opts);
  // const timeUsEastSubscription = stan.subscribe('time.us.east', opts);
  // const timeUsEastAtlantaSubscription = stan.subscribe('time.us.east.atlanta', opts);
  // const timeEsEastSubscription = stan.subscribe('time.eu.east', opts);
  // const timeEuWarsawSubscription = stan.subscribe('time.eu.warsaw', opts);
  // const subscriptions = [
  //   timeUsSubscription,
  //   timeUsEastSubscription,
  //   timeUsEastAtlantaSubscription,
  //   timeEsEastSubscription,
  //   timeEuWarsawSubscription,
  // ];
  // const subscriptionsString = [
  //   "timeUsSubscription",
  //   "timeUsEastSubscription",
  //   "timeUsEastAtlantaSubscription",
  //   "timeEsEastSubscription",
  //   "timeEuWarsawSubscription",
  // ];
  // subscriptions.map((item, index) => {
  //   item.on('message', function(message) {
  //     console.log("TCL: subscriptionsString[index]", subscriptionsString[index]);
  //     console.log("TCL: msg.getSequence()", message.getSequence())
  //     console.log("TCL: msg.getData()", message.getData())
  //   });
  // })
  // stan.publish("time.us.east", JSON.stringify({ message: "publish time.us.east" }))
  // stan.publish("time.us.east.atlanta", JSON.stringify({ message: "time.us.east.atlanta" }));
});

// stan.on('close', function () {
//   process.exit();
// });
