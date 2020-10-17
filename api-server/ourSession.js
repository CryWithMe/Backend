const redis = require("redis");
const session = require('express-session');
const redisStore = require('connect-redis')(session);
const client = redis.createClient(process.env.REDIS_URL);
const {log}  = require('@rama41222/node-logger');




exports.init = function(app){

    client.AUTH(process.env.REDIS_PASSWORD,function(err,res){
      if(err){
        logger.error(err);
      }
      else{
        logger.info("Connected to redis");
      }
    });
    app.use(session({
        secret:"Taco Bell Secret Sauce",
        store: new redisStore({host: process.env.REDIS_URL, port: 6379, client: client}),
        saveUninitialized: false,
        resave: true
    }));
}