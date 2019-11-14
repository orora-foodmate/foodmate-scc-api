const socketCluster = require('socketcluster-client');

var options = {
  port: 8000
};

// Initiate the connection to the server
var socket = socketCluster.create(options);

socket.on('connect', function (socket) {
  console.log('CONNECTED socket id: ', socket.id);
});