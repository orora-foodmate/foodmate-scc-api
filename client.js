var SocketCluster = require('socketcluster');

var socketCluster = new SocketCluster(options);

var socket = socketCluster.create();
socket.emit('sampleClientEvent', {message: 'This is an object with a message property'});