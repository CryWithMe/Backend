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
}