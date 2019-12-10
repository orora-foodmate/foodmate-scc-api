
"use-strict";

const stan = require('node-nats-streaming').connect('nats-streaming', 'test1', { port: 14222 });

stan.on('connect', function () {

  const opts = stan.subscriptionOptions().setDeliverAllAvailable();
  const timeUsSubscription = stan.subscribe('time.us', opts);
  const timeUsEastSubscription = stan.subscribe('time.us.east', opts);
  const timeUsEastAtlantaSubscription = stan.subscribe('time.us.east.atlanta', opts);
  const timeEsEastSubscription = stan.subscribe('time.eu.east', opts);
  const timeEuWarsawSubscription = stan.subscribe('time.eu.warsaw', opts);
  const subscriptions = [
    timeUsSubscription,
    timeUsEastSubscription,
    timeUsEastAtlantaSubscription,
    timeEsEastSubscription,
    timeEuWarsawSubscription,
  ];
  const subscriptionsString = [
    "timeUsSubscription",
    "timeUsEastSubscription",
    "timeUsEastAtlantaSubscription",
    "timeEsEastSubscription",
    "timeEuWarsawSubscription",
  ];
  subscriptions.map((item, index) => {
    item.on('message', function(message) {
      console.log("TCL: subscriptionsString[index]", subscriptionsString[index]);
      console.log("TCL: msg.getSequence()", message.getSequence())
      console.log("TCL: msg.getData()", message.getData())
    });
  })
  // stan.publish("time.us.east", JSON.stringify({ message: "publish time.us.east" }))
  // stan.publish("time.us.east.atlanta", JSON.stringify({ message: "time.us.east.atlanta" }));
});

stan.on('close', function () {
  process.exit();
});