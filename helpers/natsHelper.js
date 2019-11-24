const nats = require('nats');
const servers = [
  'nats://nats.tomas.website'
];

const nc = nats.connect({'servers': servers});


let c1 = 0;
const sid1 = nc.subscribe(subj, {queue: 'q1'}, () => {
    c1++;
    if(c1 === 1) {
        nc1.drainSubscription(sid1, () => {
            // subscription drained - possible arguments are an error or
            // the sid (number) and subject identifying the drained
            // subscription
        });
    }
});


// It is possible to drain a connection, draining a connection:
// - drains all subscriptions
// - after calling drain it is impossible to make subscriptions or requests
// - when all subscriptions are drained, it is impossible to publish
// messages and drained connection is closed.
// - finally, the callback handler is called (with possibly an error).

let c2 = 0;
nc.subscribe(subj, {queue: 'q1'}, () => {
    c2++;
    if(c2 === 1) {
        nc1.drain(() => {
            // connection drained - possible arguments is an error
            // connection is closed by the time this function is
            // called.
        });
    }
});