
const encryption = require("./models/Encryption");

function validatePassword(username, password){
    return 12;
}

exports.init = function(app){
    app.post("/login",function(req, res){

        //Get Salt And Hash From DB

        //Create Salted Hash based on password

        //Compare

            //Get User ID
            //Set Session userID

            //Return 200 if true

        
        
        //Return 401 if login is bad
        


    });

    app.post("/createAccount", function(req,res){

        //Check if username exists

        //If it does return 401 username already exists

        //If it does not
        //Check if password is valid
        //If invalid return 401
        //Else 
            //Get Salt and Hash based on pw
            //Insert Login Info into Database
            //Insert User Info into database
            

            //Return 200

        res.send(200)
    })
}