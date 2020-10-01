
"use-strict";

const stan = require('node-nats-streaming').connect('nats-streaming', 'test', {port: 14222});

stan.on('connect', function () {
console.log("connect");
  const opts = stan.subscriptionOptions();
  opts.setStartWithLastReceived();
  const subscription = stan.subscribe('foo', 'foo.workers', opts);

  const guid = stan.publish('foo', 'Hello World!', function(err, aGuid){
    // err will be undefined if the message was accepted by the 
    // NATS streaming server
    if(err) {
      console.log('Error publishing: ' + aGuid + ' - ' + err);
    }
  });

  opts.setManualAckMode(true);
  opts.setAckWait(60*1000); //60s

  const sub = stan.subscribe('Foo', opts);

  sub.on('message', function (msg) {
  console.log("TCL: msg", msg)
    // do something with the message
    msg.ack();        
  });
});

stan.on('close', function() {
  process.exit();
});