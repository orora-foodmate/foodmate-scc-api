
"use-strict";
// const NATS = require('nats')
const servers = ['nats://127.0.0.1:14222', 'nats://127.0.0.1:24222', 'nats://127.0.0.1:34222']
// Randomly connect to a server in the cluster group.
// Note that because `url` is not specified, the default connection is called first
// (nats://localhost:4222). If you don't want default connection, specify one of
// the above the above servers as `url`: `nats.connect(servers[0], {'servers': servers});`
// let nc = NATS.connect({ servers: servers,  json: true })

// currentServer is the URL of the connected server.
// nc.on('connect', () => {
//   console.log('Connected to ' + nc.currentServer.url.host)
//   nc.publish('updates', "All is Well");
// })

const stan = require('node-nats-streaming').connect('nats-streaming', 'test1', {servers});

stan.on('connect', function () {
  stan.publish("foo", "Hello node-nats-streaming!", (err, guid) => {
    if (err) {
      console.log("publish failed: " + err);
    } else {
      console.log("published message with guid: " + guid);
    }
  });
// console.log("connect");
//   const opts = stan.subscriptionOptions();
//   opts.setStartWithLastReceived();
//   const subscription = stan.subscribe('foo', 'foo.workers', opts);

//   const guid = stan.publish('foo', 'Hello World!', function(err, aGuid){
//     // err will be undefined if the message was accepted by the 
//     // NATS streaming server
//     if(err) {
//       console.log('Error publishing: ' + aGuid + ' - ' + err);
//     }
//   });

//   opts.setManualAckMode(true);
//   opts.setAckWait(60*1000); //60s

//   const sub = stan.subscribe('Foo', opts);

//   sub.on('message', function (msg) {
//   console.log("TCL: msg", msg)
//     // do something with the message
//     msg.ack();        
//   });
// });

// stan.on('close', function() {
//   process.exit();
});