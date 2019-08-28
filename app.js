const express = require('express');
const logger = require('morgan');
const session = require('express-session');
const connectRedis = require('connect-redis');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const dotenv = require('dotenv');

dotenv.config();
const {jwtAuthorizationMiddleware} = require("./helpers/passportManager")

const {REDIS_PORT, REDIS_HOST, AUTH_SECRET} = process.env;

const app = express();

const expressWs = require('express-ws')(app);

const RedisStore = connectRedis(session);
app.set('trust proxy', 1) // trust first proxy

app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  store: new RedisStore({
    host: REDIS_HOST,
    port: REDIS_PORT,
  }),
  secret: AUTH_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true,
    maxAge: 60 * 60 * 24 * 1000 // 1天
  }
}));

app.use(passport.initialize());
app.use(passport.session());


const indexRouter = require('./routes/index');

app.use('/v1', indexRouter);

app.ws('/', async() => {
  ws.on('message', function(msg) {
    console.log(msg);
  });
  console.log('socket', req.testing);
});

app.use((req, res) => {
  res.json({message: "route not found"});
});

module.exports = app;
