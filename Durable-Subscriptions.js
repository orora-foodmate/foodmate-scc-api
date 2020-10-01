const stan = require('node-nats-streaming').connect('nats-streaming', 'test1', { port: 14222 });

stan.on('connect', function () {
  // Subscribe with durable name
  const opts = stan.subscriptionOptions();
  opts.setDeliverAllAvailable();
  opts.setDurableName('my-durable');

  const durableSub = stan.subscribe('foo', opts);
  durableSub.on('message', function(msg) {
    console.log('Received a message: ' + msg.getData());
  });

  //... 
  // client suspends durable subscription
  //
  durableSub.close();

  //...
  // client resumes durable subscription
  //
  durableSub = stan.subscribe('foo', opts);
  durableSub.on('message', function(msg) {
    console.log('Received a message: ' + msg.getData());
  });

  // ...
  // client receives message sequence 1-40, and disconnects
  stan.close();

  // client reconnects in the future with same clientID
  // const stan = require('node-nats-streaming').connect('test-cluster', 'client-123');
  const durableSub = stan.subscribe('foo', opts);
  durableSub.on('message', function(msg) {
    console.log('Received a message: ' + msg.getData());
  });
});