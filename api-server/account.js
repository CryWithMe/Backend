
const encryption = require("./models/Encryption");

const pool = require("./pool").pool;
const logger = require("@rama41222/node-logger/src/logger");
const {v4} = require("uuid");


exports.init = function(app){
    app.post("/login",function(req, res){

        if(!req.body.username || ! req.body.password){
            res.sendStatus(400);
        } else {

            //Getting Connection
            pool.connect((err,client,release) => {
                if(err){
                    console.log(err);
                    res.sendStatus(400);
                    release();
                }else {
                    //Seeing if username is present
                    client.query("SELECT salt, hash, account.id FROM account JOIN login on account.id = login.accountid where account.username =$1 ORDER BY login.lastupdatedate DESC LIMIT 1;", [req.body.username],
                            (err,result) => {
                                if(err){
                                    console.log(err);
                                    res.sendStatus(400);
                                } else {
                                    if(result.rows[0] && result.rows[0].hash == encryption.getHash(result.rows[0].salt, req.body.password)){
                                        
                                        req.session.accountId = result.rows[0].id;
                                        
                                        res.sendStatus(200);
                                    } else {
                                        res.sendStatus(401);
                                    }
                                }
                                release();
                            })
                }
            });
        }
        //Get Salt And Hash From DB
        
        //Create Salted Hash based on password

        //Compare

            //Get User ID
            //Set Session userID

            //Return 200 if true

        
        
        //Return 401 if login is bad
        


    });

    app.post("/logout", function(req,res){
        
        if(req.session.accountId){
            req.session.accountId = null;
            res.sendStatus(200);
        } else {
            res.sendStatus(401);
        }
    })

    app.post("/createAccount", function(req,res){

        if(!req.body.username || !req.body.password || !req.body.email || !req.body.fname || !req.body.lname){
            res.sendStatus(401);
        }
        else {
        //Getting Connection
            pool.connect((err,client,release) => {
                if(err){
                    console.log(err);
                    res.send(400)
                }
                
                //Seeing if username is present
                client.query("SELECT id FROM ACCOUNT WHERE username = $1", [req.body.username], (err,result)=>{
                    
                    if(err){
                        console.log(err);
                        res.send(400)
                    }
                    //If username is not taken
                    if(result.rowCount == 0){
                        salt = encryption.getSalt();
                        hash = encryption.getHash(salt, req.body.password);

                        accountId = v4();
                        
                        client.query("INSERT INTO ACCOUNT(id, username, lastUpdateDate, fname, lname, email) VALUES ($1,$2,current_timestamp, $3, $4, $5);", [accountId, req.body.username, req.body.fname, req.body.lname, req.body.email], (err,result)=>{
                            if(err){
                                console.log(err);
                                res.send(400);
                            }
                            else{
                                
                                client.query("INSERT INTO Login(accountId, salt,hash, lastUpdateDate) VALUES ($1,$2,$3, current_timestamp);", [accountId, salt,hash], (err,result)=>{
                                    
                                    if(err){
                                        console.log(err);
                                        res.sendStatus(400)
                                    } else{
                                        
                                        req.session.accountId = accountId;
                                        
                                        res.sendStatus(200);
                                    }
                                    release()
                                });
                            }
                        });

                    }else {
                        res.sendStatus(401);
                        release();
                    }
                    

                });
            })};

        })
}