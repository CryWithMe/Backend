
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
                    client.query("SELECT * FROM verifyLogin($1);", [req.body.username],
                            (err,result) => {
                                if(err){
                                    console.log(err);
                                    res.sendStatus(400);
                                } else {
                                    //Checking if passwords matches salt and hash
                                    if(result.rows[0] && result.rows[0].hash == encryption.getHash(result.rows[0].salt, req.body.password) && result.rows[0].active){
                                        
                                        
                                        res.status(200).send(result.rows[0].id);
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

    app.put("/changePassword", (req,res) => {
        if(req.body.accountId && req.body.newPassword){
            salt = encryption.getSalt();
            hash = encryption.getHash(salt, req.body.newPassword);

            pool.connect((err,client,release) => {
                if(err){
                    res.sendStatus(500);
                } else {
                    client.query("SELECT * FROM changePassword($1,$2,$3);", [req.body.accountId, salt,hash], (err,result)=>{
                        if(err){
                            res.sendStatus(500);
                        } else {
                            res.sendStatus(200);
                        }
                    })
                }
                release()
            })
        } else {
            res.sendStatus(400);
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
        } else {
            pool.connect((err,client,release)=>{
                if(err){
                    res.sendStatus(500);
                }else{
                    salt = encryption.getSalt();
                    hash = encryption.getHash(salt, req.body.newPassword);
                    client.query("SELECT * FROM createAccount($1,$2,$3,$4,$5,$6,$7);",
                                [v4(),req.body.username, req.body.fname, req.body.lname, req.body.email, salt, hash],
                                (err,rows)=>{
                                    if(err){
                                        res.sendStatus(500);
                                    } else {
                                        console.log(rows.rows);
                                        if(rows.rows[0].createaccount){
                                            res.sendStatus(200);
                                        }else{
                                            res.status(400).send("Username Taken");
                                        }
                                    }
                                })
                }
                release();
            })
        }
    });

    //Deletes account
    //Returns 200 if account exists and is deletable
    //Returns 400 if account does not exist
    app.post("/deleteAccount", function(req,res){
        console.log(req.body);
        if(req.body.accountId){
            pool.connect((err,client,release) =>{
                if(err){
                    console.log(err);
                    res.sendStatus(500);
                } else {
                    client.query("SELECT * FROM account WHERE account.id = $1 ORDER BY account.lastUpdateDate LIMIT 1;", [req.body.accountId], (err,result) => {
                        if(result.rows[0].active){
                            client.query("INSERT INTO Account(id,username,fname,lname,email,lastupdatedate,active) VALUES($1,$2,$3,$4,$5, current_timestamp, false);",[result.rows[0].id, result.rows[0].username, result.rows[0].fname, result.rows[0].lname,result.rows[0].email], (err,result)=>{
                                if(err){
                                    res.sendStatus(500);
                                } else {
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

    app.put("/updateAccount", (req,res)=> {
        if(req.body.accountId && req.body.username && req.body.fname && req.body.lname && req.body.email){
            pool.connect((err,client,release)=>{
                if(err){
                    res.sendStatus(500);
                } else {
                    client.query(`INSERT INTO
                                    account(
                                        id,
                                        username,
                                        fname,
                                        lname,
                                        email,
                                        lastupdatedate,
                                        active
                                    )
                                VALUES(
                                    $1,
                                    $2,
                                    $3,
                                    $4,
                                    $5,
                                    current_timestamp,
                                    true
                                );`,
                                [req.body.accountId,req.body.username,req.body.fname,req.body.lname,req.body.email],
                                (err,rows)=>{
                                    if(err){
                                        console.log(err);
                                        res.sendStatus(500)
                                    } else {
                                        res.sendStatus(200)
                                    }
                                })
                }
                release()
            })
        } else {
            res.sendStatus(400);
        }
    })

    app.get("/accountInfo/:accountId", (req,res)=>{
        pool.connect((err,client,release) => {
            if(err){
                console.log(err);
            } else {
                client.query("SELECT account.username, account.fname, account.lname, account.email FROM account WHERE account.id =$1 ORDER BY account.lastUpdateDate DESC LIMIT 1;", [req.params.accountId], (err,result) =>{
                    if(err){
                        console.log(err);
                        res.sendStatus(500);
                    } else {
                        res.status(200).send(result);
                    }
                })
            }

            release();
        })
    })

    app.get("/searchAccount/:username", (req,res) =>{
        if(req.params.username){
            pool.connect( (err,client,release) => {
                if(err){
                    console.log(err);
                } else {
                    client.query(`
                        SELECT 
                            account.fname, account.lname
                        FROM (
                            SELECT 
                                lastUpdateDate
                            FROM
                                account
                            WHERE
                                account.username = $1
                            ORDER BY
                                lastupdatedate
                            DESC LIMIT 1
                        ) as time
                        JOIN
                            account
                        ON 
                            account.lastUpdateDate = time.lastUpdateDate
                        WHERE
                            account.username = $1
                        AND
                            account.active = true;
                        `, [req.params.username],
                        (err,rows) => {
			
                            if(err){
                                res.sendStatus(500);
                            }else {
                                if(rows.rowCount==0){
                                    res.sendStatus(404)
                                }else {
                                    res.send(rows.rows);
                                }
                            }
                        })
                }
                release();
            })
        }
    })
}
