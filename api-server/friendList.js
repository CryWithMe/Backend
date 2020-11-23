const pool = require("./pool").pool;

//Routes Relating to friendlist

//Will duplicate Friend List
exports.init = function(app){

    //Send a friend request Route
    app.post("/friendRequest", (req,res)=>{
        //Checking if account is logged in to the session
        if(!req.body.accountId){
            res.sendStatus(400);
        } 
        else{
            //Checking if req has a username
            if(req.body.username){

                //grabbing a connection
                pool.connect( (err,client,release) => {
                    if(err){
                        res.sendStatus(500);
                    } else {
                        //Checking an account
                        client.query("SELECT * FROM account WHERE account.username = $1 ORDER BY account.lastupdatedate DESC LIMIT 1;", 
                                    [req.body.username], 
                                    (err,result)=>{
                                        if(err) {
                                            res.sendStatus(500);
                                        }

                                        //Checking if account exists and is active
                                        else if(result.rows[0] && result.rows[0].id != req.body.accountId && result.rows[0].active){
                                            //Inserting into friends list
                                            client.query("INSERT INTO friendlist(sender,recipient,state, lastupdatedate) VALUES($1, $2, 'pending', current_timestamp);", [req.body.accountId, result.rows[0].id],
                                            (err, result)=>{
                                                //If error, server is sad
                                                if(err){
                                                    res.sendStatus(500);
                                                }else {
                                                    //We Chilling
                                                    res.sendStatus(200);
                                                }
                                            })
                                        }
                                    })
                        release();
                    }
                });
            } else {
                res.sendStatus(400)
            }
        }
    });

    //Route to get current pending friend requests
    app.get("/friendRequests/:accountId", (req,res)=>{
        
        //If logged in
        if(!req.params.accountId){
            res.sendStatus(400)
        }
        else{
            //Get Connection
            pool.connect( (err,client,release)=>{
                if(err){
                    res.sendStatus(500);
                } else {

                    //See if the most recent row of the sender and recipient is pending, really complicated but makes sense
                    client.query(`SELECT 
                    account.fname, 
                    account.lname, 
                    account.username
                FROM (SELECT 
                    recipient as id, 
                    max(lastupdatedate)
                FROM 
                    friendlist
                WHERE 
                    sender =$1 
                GROUP BY 
                    recipient 
                UNION 
                SELECT 
                    sender as id, 
                    max(lastupdatedate)
                FROM 
                    friendlist 
                WHERE 
                    recipient = $1 
                GROUP BY 
                    sender) as y
                JOIN
                    friendlist
                ON
                    y.max = friendlist.lastupdatedate
                JOIN 
                    account
                ON 
                    friendlist.sender = account.id
                OR
                    friendlist.recipient = account.id
                WHERE 
                    account.id != $1
                AND 
                    friendlist.state = 'pending'
                AND 
                    friendlist.recipient = $1
                AND account.active = true`,
                            [req.params.accountId],
                            (err,rows)=>{
                                if(!err){
                                    res.send(rows);
                                } else {
                                    res.sendStatus(400);
                                }
                            })
                }
                release();
            })
        }
    })

    //Route to accept a friend request
    app.post("/acceptFriendRequest", (req,res) => {
        //Seeing if they have an account id and username
        if(!req.body.accountId && req.body.username){
            res.sendStatus(400)
        } else {
            pool.connect( (err,client,release) =>{
                if(err){
                    res.sendStatus(500);
                } else{

                    //Seeing if there is a pending friend request
                    client.query(`SELECT account.id FROM account where username =$1 ORDER BY lastupdatedate DESC LIMIT 1;`, 
                                    [req.body.username], 
                                    (err,rows)=>{
					console.log(rows);
                                        if(err){
						console.log(err);
                                            res.sendStatus(400)
                                        } else {
                                            //Inserting accepted to the table
                                            client.query(`INSERT INTO friendlist(sender,recipient,state,lastupdatedate)
                                                            VALUES($1,$2, 'accepted', current_timestamp);`,
                                                            [req.body.accountId,
                                                            rows.rows[0].id],
                                                            (err2,rows2)=>{
                                                                if(err2){
                                                                    res.sendStatus(400)
                                                                } else {
                                                                    res.sendStatus(200);
                                                                }
                                                            })
                                        }
                                    })
                }
                release()
            }
            
            )
        }

    })

    //Route to Deny a friend request
    app.post("/denyFriendRequest", (req,res) => {
        //Seeing if they have an account id and username
        if(!req.body.accountId && req.body.username){
            res.sendStatus(400)
        } else {
            pool.connect( (err,client,release) =>{
                if(err){
                    res.sendStatus(500);
                } else{
                    //Seeing if there is a pending friend request
                    client.query(`SELECT account.id FROM account where username =$1 ORDER BY lastupdatedate DESC LIMIT 1;`, 
                                    [req.body.username], 
                                    (err,rows)=>{
					console.log(rows);
                                        if(err){
						console.log(err);
                                            res.sendStatus(400)
                                        } else {
                                            //Inserting accepted to the table
                                            client.query(`INSERT INTO friendlist(sender,recipient,state,lastupdatedate)
                                                            VALUES($1,$2, 'denied', current_timestamp);`,
                                                            [req.body.accountId,
                                                            rows.rows[0].id],
                                                            (err2,rows2)=>{
                                                                if(err2){
                                                                    res.sendStatus(400)
                                                                } else {
                                                                    res.sendStatus(200);
                                                                }
                                                            })
                                        }
                                    })
                }
                release()
            }
            
            )
        }

    })

    //Get Friend List
    app.get("/friendList/:accountId", (req,res) => {
        if(req.params.accountId){
            pool.connect((err,client,release) => {
                if(!err){
                    client.query(`SELECT 
                                        account.fname, 
                                        account.lname, 
                                        account.username
                                    FROM (SELECT 
                                        recipient as id, 
                                        max(lastupdatedate)
                                    FROM 
                                        friendlist
                                    WHERE 
                                        sender =$1 
                                    GROUP BY 
                                        recipient 
                                    UNION 
                                    SELECT 
                                        sender as id, 
                                        max(lastupdatedate)
                                    FROM 
                                        friendlist 
                                    WHERE 
                                        recipient = $1 
                                    GROUP BY 
                                        sender) as y
                                    JOIN
                                        friendlist
                                    ON
                                        y.max = friendlist.lastupdatedate
                                    JOIN 
                                        account
                                    ON 
                                        friendlist.sender = account.id
                                    OR
                                        friendlist.recipient = account.id
                                    WHERE 
                                        account.id != $1
                                    AND 
                                        friendlist.state = 'accepted'
                                    AND account.active = true;`,
                                    [req.params.accountId],
                                    (err,rows)=>{
                                        if(err) {
					                        console.log(err);
                                            res.sendStatus(500);
                                        } else {
                                            res.send(rows);
                                        }
                                    })
                } else {
                    res.sendStatus(500);
                }
            
            release();
            })
        } else {
            res.sendStatus(400);
        }
    })

    app.post("/deleteFriend", (req,res) => {
        if(req.body.accountId && req.body.username){
            pool.connect((err,client,release) => {
                if(!err){
                    client.query(`SELECT id FROM account WHERE username = $1 ORDER BY lastUpdateDate DESC LIMIT 1;`,
                                    [req.body.username],
                                    (err,rows)=>{
                                        if(err) {
                                            res.sendStatus(500);
                                        } else {
                                            if(rows.rows[0]) {
                                                client.query(`INSERT INTO friendlist(sender,recipient,state,lastupdatedate) VALUES($1,$2,'deleted',current_timestamp);`,
								 [req.body.accountId, rows.rows[0].id],
                                                            (err2,rows2)=>{
								
								
                                                                if(err2){
                                                                    res.sendStatus(500);
                                                                }else {
                                                                    res.sendStatus(200);
                                                                }
                                                            })
                                            }
                                            else {
                                                res.sendStatus(400);
                                            }
                                        }
                                    })
                } else {
                    res.sendStatus(500);
                }
            release()
            })
        } else {
            res.sendStatus(400);
        }
    })
}
