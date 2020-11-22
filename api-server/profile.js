const pool = require("./pool").pool;

exports.init = function(app){

    app.post("/condition", function(req,res){
        if(req.body && req.body.accountId && req.body.condition){
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
                release();
            })
        } else {
	    res.sendStatus(400);
	}
    })

    app.get("/condition/:username", (req,res) => {
        if(req.params.username){
            pool.connect((err,client,release)=> {
                if(err){
                    res.sendStatus(500);
                } else {
                    client.query(
                        `SELECT 
                            condition.condition
                        FROM
                            condition
                        JOIN
                            account
                        ON
                            account.id=condition.id
                        WHERE
                            account.username = $1
                        ORDER BY
                            condition.lastupdatedate
                        DESC LIMIT 1;`,
                        [req.body.username],
                        (err,rows)=>{
                            if(err){
                                res.sendStatus(500)
                            }else {
                                res.status(200).send(rows);
                            }
                        })
                }
            })
        } else {
            res.sendStatus(400);
        }


    })


    app.post("/comfort", (req,res) => {
        if(req.body.accountId && req.body.comfort){
            pool.connect((err,client,release) => {
                if(err){
                    console.log(err);
                    res.sendStatus(500);
                } else {
                    client.query(`INSERT INTO 
                                    comforts(
                                        id,
                                        comfort,
                                        active,
                                        lastupdatedate)
                                    VALUES(
                                        $1,
                                        $2,
                                        'true',
                                        current_timestamp
                                    );`,
                                    [req.body.accountId,
                                    req.body.comfort],
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

    app.get("/comfort/:username", (req,res) => {
        if(req.params.username){
            pool.connect((err,client,release)=> {
                if(err){
                    res.sendStatus(500);
                } else {
                    client.query(
                        `SELECT 
                            comfort.condition
                        FROM
                            comfort
                        JOIN
                            account
                        ON
                            account.id=comfort.id
                        WHERE
                            account.username = $1
                        ORDER BY
                            comfort.lastupdatedate
                        DESC LIMIT 1;`,
                        [req.body.username],
                        (err,rows)=>{
                            if(err){
                                res.sendStatus(500)
                            }else {
                                res.status(200).send(rows);
                            }
                        })
                }
            })
        } else {
            res.sendStatus(400);
        }


    })




}
