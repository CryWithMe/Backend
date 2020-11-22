const pool = require("./pool").pool;
const {v4} = require("uuid");
exports.init = (app) => {

    app.post("/token", (req,res)=>{
        if(req.body.accountId && req.body.token){
            pool.connect( (err,client,release) =>{
                if(err){
                    res.sendStatus(500);
                } else {
                    client.query("INSERT INTO push(id,pushtoken,active,lastupdatedate) VALUES($1,$2, true, current_timestamp);", [req.body.accountId && req.body.token], (err,result)=>{
                        if(err){
                            res.sendStatus(500)
                        }else {
                            res.sendStatus(200);
                        }
                    })
                }
            release();
            })
        }
    })

    app.post("/event", (req,res) => {
        if(req.body.accountId && req.body.type) {
            pool.connect((err,client,release) => {
                if(err){
                    res.sendStatus(500);
                } else {
                    client.query(`SELECT 
                        push.pushtoken
                    FROM (SELECT 
                        recipient as id, 
                        max(lastupdatedate)
                    FROM 
                        friendlist
                    WHERE 
                        sender = $1 
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
                    JOIN
                        push
                    ON
                        account.id = $1;`,
                    [req.body.accountId], (err,rows)=> {
                        res.status(200).send(rows);
                        client.query("INSERT INTO event(sender,eventid,type,date) VALUES($1,$2,$3, current_timesamp);",
                                    [req.body.accountId, v4(), req.body.type],
                                    (err2,rows2)=>{
                                        if(err2){
                                            console.log(err2);
                                            res.sendStatus(500)
                                        }else {
                                            res.sendStatus(200);
                                        }
                                    })
                        release();
                    })
                }
            })
        }
    })

    app.post("/eventResponse", (req,res) => {
        if(req.body.accountId, req.body.username){
            pool.connect((err,client,release)=>{
                if(err){
                    res.sendStatus(500);
                } else {
                    client.query(`SELECT 
                                    event.eventid as eventid, push.token as token,account.id as accountid
                                FROM 
                                    event 
                                JOIN 
                                    account 
                                ON 
                                    event.sender = account.id 
                                JOIN 
                                    push 
                                ON 
                                    id = account.id 
                                WHERE 
                                    account.username = $1 
                                ORDER BY 
                                    event.date 
                                DESC LIMIT 1;`,
                                [req.body.username], 
                                (err,rows) => {
                                    if(!err && rows.rowCount>0){
                                        client.query(`
                                            INSERT INTO
                                                response(
                                                    responder,
                                                    eventid,
                                                    responseid,
                                                    type,
                                                    date
                                                ) 
                                            VALUES(
                                                $1,
                                                $2,
                                                $3,
                                                $4,
                                                current_timestamp
                                            );
                                        `, [rows.rows[0].accountid, rows.rows[0].eventid, v4(), req.body.type ?  req.body.type: 'none'],
                                            (err2,row2) => {
                                                if(err2){
                                                    console.log(err2);
                                                    res.sendStatus(500);
                                                } else {
                                                    res.status(200).send(rows[0].token);
                                                }
                                            })
                                    }
                                })
                }
                release();
            })
        } else {
            res.sendStatus(400)
        }
    })

    app.get("/eventList/:id", (req,res) => {
        if(req.params.id){
            pool.connect((err,client,release)=>{
                if(err){
                    res.sendStatus(500)
                } else{
                    client.query(`
                SELECT
                    account.username,
                    event.type, 
                    event.date 
                FROM
                    (SELECT 
                        account.id
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
                        AND account.active = true) as friends
                JOIN
                    event
                ON 
                    event.sender = friends.id
                JOIN
                    account
                ON
                    friends.id = account.id
                WHERE
                    event.date
                BETWEEN
                    NOW() - INTERVAL '48 HOURS' and NOW()
                ORDER BY
                    event.date
                DESC;`,
                [req.params.id],
                (err,rows) =>{
                    if(err){
                        console.log(err);
                        res.sendStatus(500);
                    } else {
                        res.status(200).send(rows.rows);
                    }
                })
                }
                release()
            })
        }
    })
}