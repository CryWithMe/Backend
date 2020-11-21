const pool = require("./pool").pool;

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
            })
        }
    })
}