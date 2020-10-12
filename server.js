const express = require("express");
const isEmpty = require("lodash/isEmpty");
const serveStatic = require("serve-static");
const path = require("path");
const morgan = require("morgan");
const uuid = require("uuid");
const sccBrokerClient = require("scc-broker-client");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const pick = require("lodash/pick");
const dotenv = require("dotenv");

dotenv.config();

const ENVIRONMENT = process.env.ENV || "dev";
const SOCKETCLUSTER_PORT = process.env.SOCKETCLUSTER_PORT || 8000;
const SOCKETCLUSTER_WS_ENGINE = process.env.SOCKETCLUSTER_WS_ENGINE || "ws";
const SOCKETCLUSTER_SOCKET_CHANNEL_LIMIT =
  Number(process.env.SOCKETCLUSTER_SOCKET_CHANNEL_LIMIT) || 1000;
const SOCKETCLUSTER_LOG_LEVEL = process.env.SOCKETCLUSTER_LOG_LEVEL || 2;

const SCC_INSTANCE_ID = uuid.v4();
const SCC_STATE_SERVER_HOST = process.env.SCC_STATE_SERVER_HOST || null;
const SCC_STATE_SERVER_PORT = process.env.SCC_STATE_SERVER_PORT || null;
const SCC_MAPPING_ENGINE = process.env.SCC_MAPPING_ENGINE || null;
const SCC_CLIENT_POOL_SIZE = process.env.SCC_CLIENT_POOL_SIZE || null;
const SCC_AUTH_KEY = process.env.SCC_AUTH_KEY || null;
const SCC_INSTANCE_IP = process.env.SCC_INSTANCE_IP || null;
const SCC_INSTANCE_IP_FAMILY = process.env.SCC_INSTANCE_IP_FAMILY || null;
const SCC_STATE_SERVER_CONNECT_TIMEOUT =
  Number(process.env.SCC_STATE_SERVER_CONNECT_TIMEOUT) || null;
const SCC_STATE_SERVER_ACK_TIMEOUT =
  Number(process.env.SCC_STATE_SERVER_ACK_TIMEOUT) || null;
const SCC_STATE_SERVER_RECONNECT_RANDOMNESS =
  Number(process.env.SCC_STATE_SERVER_RECONNECT_RANDOMNESS) || null;
const SCC_PUB_SUB_BATCH_DURATION =
  Number(process.env.SCC_PUB_SUB_BATCH_DURATION) || null;
const SCC_BROKER_RETRY_DELAY =
  Number(process.env.SCC_BROKER_RETRY_DELAY) || null;

const { httpServer, agServer } = require("./helpers/agServerCreator");

// let httpServer = eetase(http.createServer());
// let agServer = socketClusterServer.attach(httpServer, agOptions);

let expressApp = express();
if (ENVIRONMENT === "dev") {
  // Log every HTTP request. See https://github.com/expressjs/morgan for other
  // available formats.
  expressApp.use(morgan("dev"));
}
expressApp.use(serveStatic(path.resolve(__dirname, "public")));

expressApp.use(cors());
expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: false }));
expressApp.use(cookieParser());

const tokenVerifyMiddleware = require('./helpers/tokenVerify');
const userRoute = require("./routes/userRoute");
const friendRoute = require("./routes/friendRoute");
const messageRoute = require("./routes/messageRoute");

const { userModel, messageModel } = require("./models");
const { saltHashPassword } = require("./helpers/utils");
const { getMessagesLisenter } = require("./socketEvents/messageEvents");
const { getRoomsLisenter } = require("./socketEvents/roomEvents");

expressApp.use("/users", userRoute);
expressApp.use("/friends", tokenVerifyMiddleware, friendRoute);
expressApp.use("/messages", tokenVerifyMiddleware, messageRoute);

// Add GET /health-check express route
expressApp.get("/health-check", tokenVerifyMiddleware, (req, res) => {
  res.status(200).json({ success: true });
});

expressApp.post("/login", async (req, res) => {
  try {
    const { account, password } = req.body;
    const user = await userModel.findOne({ account });
    const hashPassword = saltHashPassword(password, process.env.SALT_SECRET);
  
    if (user.hashPassword !== hashPassword) {
      return res.status(401).json({
        success: false,
        data: {
          message: "authorization fail",
        },
      });
    }
  
    const myTokenData = pick(user, ["_id", "account", "avatar", "name"]);
    const signedTokenString = await agServer.auth.signToken(
      myTokenData,
      agServer.signatureKey
    );
  
    res.status(200).json({
      success: true,
      data: {
        ...myTokenData,
        token: signedTokenString,
      },
    });
  }catch(error) {
    res.status(500).json({success: false, data: {message: error.message}})
  }
  
});

// HTTP request handling loop.
(async () => {
  for await (let requestData of httpServer.listener("request")) {
    expressApp.apply(null, requestData);
  }
})();

// SocketCluster/WebSocket connection handling loop.
(async () => {
  for await (let { socket } of agServer.listener("connection")) {
    if(isEmpty(socket.authToken)) {
      console.log("forawait -> isEmpty(socket.authToken)", isEmpty(socket.authToken))
      socket.disconnect(4101, "auth fail");
      return;
    }

    // Handle socket connection.
    getMessagesLisenter(socket);
    getRoomsLisenter(socket);
  }
})();

httpServer.listen(SOCKETCLUSTER_PORT);

if (SOCKETCLUSTER_LOG_LEVEL >= 1) {
  (async () => {
    for await (let { error } of agServer.listener("error")) {
      console.error(error);
    }
  })();
}

if (SOCKETCLUSTER_LOG_LEVEL >= 2) {
  console.log(
    `   ${colorText("[Active]", 32)} SocketCluster worker with PID ${
      process.pid
    } is listening on port ${SOCKETCLUSTER_PORT}`
  );

  (async () => {
    for await (let { warning } of agServer.listener("warning")) {
      console.warn(warning);
    }
  })();
}

function colorText(message, color) {
  if (color) {
    return `\x1b[${color}m${message}\x1b[0m`;
  }
  return message;
}

if (SCC_STATE_SERVER_HOST) {
  // Setup broker client to connect to SCC.
  let sccClient = sccBrokerClient.attach(agServer.brokerEngine, {
    instanceId: SCC_INSTANCE_ID,
    instancePort: SOCKETCLUSTER_PORT,
    instanceIp: SCC_INSTANCE_IP,
    instanceIpFamily: SCC_INSTANCE_IP_FAMILY,
    pubSubBatchDuration: SCC_PUB_SUB_BATCH_DURATION,
    stateServerHost: SCC_STATE_SERVER_HOST,
    stateServerPort: SCC_STATE_SERVER_PORT,
    mappingEngine: SCC_MAPPING_ENGINE,
    clientPoolSize: SCC_CLIENT_POOL_SIZE,
    authKey: SCC_AUTH_KEY,
    stateServerConnectTimeout: SCC_STATE_SERVER_CONNECT_TIMEOUT,
    stateServerAckTimeout: SCC_STATE_SERVER_ACK_TIMEOUT,
    stateServerReconnectRandomness: SCC_STATE_SERVER_RECONNECT_RANDOMNESS,
    brokerRetryDelay: SCC_BROKER_RETRY_DELAY,
  });

  if (SOCKETCLUSTER_LOG_LEVEL >= 1) {
    (async () => {
      for await (let { error } of sccClient.listener("error")) {
        error.name = "SCCError";
        console.error(error);
      }
    })();
  }
}
