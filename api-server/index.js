//CRM Application Index
//Entry point for application

//Express App that handles requests
const express = require("express");
const app = express();
const bodyParser = require("body-parser")
const cors = require("cors");
const cookieParser = require("cookie-parser");

const encryption = require("./models/Encryption");
const account = require("./account");

//Uses Rama Node Logger
//MIT Liscence
const { log, ExpressAPILogMiddleware } = require('@rama41222/node-logger');

app.use(cookieParser());

app.use(bodyParser.json());

app.use(cors({
    origin: ["http://localhost:19007", 
	     "http://localhost:19006",
	     "http://localhost:19000",
	     "http://localhost:19008",
             "http://exp://10.8.103.22:19000",
          "http://exp://10.8.122.102:19000",
	     "192.168.1.244:19000"],
    exposedHeaders: 'Authorization'
  }));

const logger = log({ label: 'user-service' , console: true, file: true });

//app.use(ExpressAPILogMiddleware(logger, { request: true }));

app.get("/", function(req,res){
    res.status(200).send("Cry With Me API is up and running");
    
});


app.listen(443, () => {
    logger.info(`Listening to requests on 443`);
});

account.init(app);

require("./friendList").init(app);

require("./pushToken").init(app);
require("./profile").init(app);
