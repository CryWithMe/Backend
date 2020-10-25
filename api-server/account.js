
const encryption = require("./models/Encryption");

const pool = require("./pool").pool;
const logger = require("@rama41222/node-logger/src/logger");
const {v4} = require("uuid");

//Function to load all of the routes into the app
//Exported into main
exports.init = function(app){
    
    //Login Function
    //Takes username and password
    //Returns 200 if username and password match most recent entry in database
    //Returns 401 is username does not exist or password does not match recent entry
    //If sucessful loads account ID into session
    app.post("/login",function(req, res){
        //Check if request has a username and password
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
                    //Seeing if username is present and is active
                    client.query("SELECT salt, hash, account.id, account.active FROM account JOIN login on account.id = login.accountid where account.username =$1 ORDER BY login.lastupdatedate DESC LIMIT 1;", [req.body.username],
                            (err,result) => {
                                if(err){
                                    console.log(err);
                                    res.sendStatus(400);
                                } else {
                                    //Checking if passwords matches salt and hash
                                    if(result.rows[0] && result.rows[0].hash == encryption.getHash(result.rows[0].salt, req.body.password) && result.rows[0].active){
                                        
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



    });

    //Logging out of session
    //Return 200 is logged in and is now logged out
    //Return 400 if no account is logged in
    app.post("/logout", function(req,res){
        
        if(req.session.accountId){
            req.session.accountId = null;
            res.sendStatus(200);
        } else {
            res.sendStatus(401);
        }
    })

    //Create an account
    //Returns 200 if account does not exist
    //Adds account to Account database and login to login database
    //Returns 400 if account exists or data is missing
    app.post("/createAccount", function(req,res){
        //Checking if data exists
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
                        
                        //Generating unique account ID
                        accountId = v4();
                        
                        //Insert into Account DB
                        client.query("INSERT INTO ACCOUNT(id, username, lastUpdateDate, fname, lname, email, active) VALUES ($1,$2,current_timestamp, $3, $4, $5, 'true');", [accountId, req.body.username, req.body.fname, req.body.lname, req.body.email], (err,result)=>{
                            if(err){
                                console.log(err);
                                res.send(400);
                            }
                            else{
                                
                                //Insert into login info
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

        });

    //Deletes account
    //Returns 200 if account exists and is deletable
    //Returns 400 if account does not exist
    app.post("/deleteAccount", function(req,res){
        //
        if(req.session.accountId){
            pool.connect((err,client,release) =>{
                if(err){
                    console.log(err);
                    res.sendStatus(500);
                } else {
                    client.query("SELECT * FROM account WHERE account.id = $1 ORDER BY account.lastUpdateDate LIMIT 1;", [req.session.accountId], (err,result) => {
                        if(result.rows[0].active){
                            client.query("INSERT INTO Account(id,username,fname,lname,email,lastupdatedate,active) VALUES($1,$2,$3,$4,$5, current_timestamp, false);",[result.rows[0].id, result.rows[0].username, result.rows[0].fname, result.rows[0].lname,result.rows[0].email], (err,result)=>{
                                if(err){
                                    res.sendStatus(500);
                                } else {
                                    req.session.accountId = null;
                                    res.sendStatus(200);
                                };
                            
                            })
                        } else{
                            res.sendStatus(401);
                        }
                    })
                }
                release();
            });
        } else {
            res.sendStatus(401);
        }
    })
}