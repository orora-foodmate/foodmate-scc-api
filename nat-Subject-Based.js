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
    } else {
    }
  });
  
});

