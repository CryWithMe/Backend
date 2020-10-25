const pool = require("./pool").pool;

//Routes Relating to friendlist
exports.init = function(app){

    //Send a friend request Route
    app.post("/friendRequest", (req,res)=>{
        //Checking if account is logged in to the session
        if(!req.session.accountId){
            res.sendStatus(400);
        } 
        else{
            //Checking if req has a username
            if(req.body.username){
                pool.connect( (err,client,release) => {
                    if(err){
                        res.sendStatus(500);
                    } else {
                        client.query("SELECT * FROM account WHERE account.username = $1 ORDER BY account.lastupdatedate DESC LIMIT 1;", 
                                    [req.body.username], 
                                    (err,result)=>{
                                        if(err) {
                                            res.sendStatus(500);
                                        }
                                        else if(result.rows[0] && result.rows[0].id != req.session.accountId && result.rows[0].active){
                                            console.log(result.rows);
                                            console.log(req.session.accountId)
                                            client.query("INSERT INTO friendlist(sender,recipient,state, lastupdatedate) VALUES($1, $2, 'pending', current_timestamp);", [req.session.accountId, result.rows[0].id],
                                            (err, result)=>{
                                                if(err){
                                                    res.sendStatus(500)
                                                }else {
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

}