
"use-strict";
const servers = ['nats://127.0.0.1:14222', 'nats://127.0.0.1:24222', 'nats://127.0.0.1:34222']

const stan = require('node-nats-streaming').connect('nats-streaming', 'test1', {servers});

stan.on('connect', function () {
  stan.publish("foo", "Hello node-nats-streaming!", (err, guid) => {
    if (err) {
    } else {
    }
  });
});