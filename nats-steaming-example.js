
"use-strict";

const stan = require('node-nats-streaming').connect('nats-streaming', 'test', {port: 14222});

stan.on('connect', function () {

  // // Simple Publisher (all publishes are async in the node version of the client)
  // stan.publish('foo', 'Hello node-nats-streaming!!', function(err, guid){
  //   if(err) {
  //     console.log('publish failed: ' + err);
  //   } else {
  //     console.log('published message with guid: ' + guid);
  //   }
  // });

  // // Subscriber can specify how many existing messages to get.
  const opts = stan.subscriptionOptions().setDeliverAllAvailable();
  console.log("TCL: opts", opts)
  const subscription = stan.subscribe('foo', opts);
  subscription.on('message', function (msg) {
    console.log('Received a message [' + msg.getSequence() + '] ' + msg.getData());
  });

  // // After one second, unsubscribe, when that is done, close the connection
  // setTimeout(function() {
  //   subscription.unsubscribe();
  //   subscription.on('unsubscribed', function() {
  //     stan.close();
  //   });
  // }, 1000);
});

stan.on('close', function() {
  process.exit();
});