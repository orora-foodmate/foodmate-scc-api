const http = require("http");
const eetase = require("eetase");
const socketClusterServer = require("socketcluster-server");

let agOptions = {
  authKey: process.env.AUTH_SECRET
};

if (process.env.SOCKETCLUSTER_OPTIONS) {
  let envOptions = JSON.parse(process.env.SOCKETCLUSTER_OPTIONS);
  Object.assign(agOptions, envOptions);
}


let httpServer = eetase(http.createServer());
let agServer = socketClusterServer.attach(httpServer, agOptions);

module.exports.agServer = agServer;
module.exports.httpServer = httpServer;
