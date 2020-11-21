const pool = require("./pool").pool;
const {v4} = require("uuid");
exports.init = (app) => {

    app.post("/token", (req,res)=>{
        if(req.body.id && req.body.token){
            pool.connect( (err,client,release) =>{
                if(err){
                    res.sendStatus(500);
                } else {
                    client.query("INSERT INTO push(id,pushtoken,active,lastupdatedate) VALUES($1,$2, true, current_timestamp);", [req.body.id && req.body.token], (err,result)=>{
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
                    client.query(`SELECT pushtoken
                    FROM push
                    JOIN (
                        SELECT *
                            FROM friendlist
                            JOIN (
                                SELECT 
                                    sender as id,
                                    MAX(lastUpdateDate)
                                FROM friendlist
                                WHERE recipient = $1
                                GROUP BY sender
                                UNION
                                SELECT 
                                    recipient as id,
                                    max(lastUpdateDate)
                                FROM friendlist
                                WHERE sender = $1
                                GROUP BY recipient
                            ) as X
                            ON 
                                friendlist.sender = x.id
                            OR
                                friendlist.recipient = x.id
                            WHERE
                                state = 'accepted') as z
                    ON
                        z.id = push.id
                    )`, [req.body.accountId], (err,rows)=> {
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
}