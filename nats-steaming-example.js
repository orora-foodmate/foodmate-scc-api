"use-strict";
const servers = [
  "nats://127.0.0.1:14222",
  "nats://127.0.0.1:24222",
  "nats://127.0.0.1:34222",
];
const isNull = require("lodash/isNull");
const { TaskIndexes } = require("./onLineState/models");
const stan = require("node-nats-streaming").connect("nats-streaming", "test", {
  servers,
});

stan.on("connect", function () {
  const getIndexItem = (item = null) => {
    if (isNull(item)) {
      const indexItem = new TaskIndexes({ id: "foo", sequence: 0 });
      indexItem.save();
      return indexItem;
    }
    return item;
  };
  TaskIndexes.findOne({ where: { id: "foo" } }, (error, item) => {
    const indexItem = getIndexItem(item);

    const opts = stan.subscriptionOptions().setDeliverAllAvailable();
    opts.setManualAckMode(true);
    opts.setAckWait(60 * 1000); // 60s
    opts.setStartAtSequence(indexItem.sequence);

    const subscription = stan.subscribe("foo", "foo.workers", opts);
    
    subscription.on("message", function (msg) {
      indexItem.sequence = indexItem.sequence + 1;
      indexItem.save();
      msg.ack();
    });
  });
  // // Subscriber can specify how many existing messages to get.

  // // After one second, unsubscribe, when that is done, close the connection
  // setTimeout(function() {
  //   subscription.unsubscribe();
  //   subscription.on('unsubscribed', function() {
  //     stan.close();
  //   });
  // }, 1000);
});

stan.on("close", function () {
  process.exit();
});
