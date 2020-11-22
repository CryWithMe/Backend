const pool = require("./pool").pool;

exports.init = (app) => {

    app.post("/condition", (req,res) => {
        if(req.body.accountId && req.body.condition){
            pool.connect((err,client,release) => {
                if(err){
                    console.log(err);
                    res.sendStatus(500);
                } else {
                    client.query(`INSERT INTO 
                                    condition(
                                        id,
                                        condition,
                                        active,
                                        lastupdatedate)
                                    VALUES(
                                        $1,
                                        $2,
                                        'true',
                                        current_timestamp
                                    );`,
                                    [req.body.accountId,
                                    req.body.condition],
                                    (err,rows)=>{
                                        if(err){
                                            res.sendStatus(500);
                                        } else {
                                            res.sendStatus(200)
                                        }
                                    })
                }
            })
        }
    })





}