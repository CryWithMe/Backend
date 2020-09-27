//CRM Application Index
//Entry point for application

//Express App that handles requests
const express = require("express");
const app = express();
const bodyParser = require("body-parser")
const cors = require("cors");
const cookieParser = require("cookie-parser");

const encryption = require("./models/Encryption");
const session = require("./ourSession");
session.init(app);
const account = require("./account");

//Uses Rama Node Logger
//MIT Liscence
const { log, ExpressAPILogMiddleware } = require('@rama41222/node-logger');

app.use(cookieParser());

app.use(bodyParser.json());

app.use(cors({
    credentials:true
  }));

const logger = log({ label: 'user-service' , console: true, file: true });


app.get("/",function(req,res){
    res.status(200).send("Cry With Me API is up and running");
    
});


app.listen(443, () => {
    logger.info(`Listening to requests on 443`);
});

account.init(app);