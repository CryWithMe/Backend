Speak Easy Backend Server

Three Components wrapped up in one docker-compose file

First is a express js rest api
    - Uses Port 443
    - Uses express to manage routes
    - Postgres SQL driver in file called pool.js
    - ourSession.js uses express session and redis to store session info
    - app is where routes are stored

Second is a postgresql database
    - Port 5432
    - Should change password and shit when deployed
    - Will use amazon RDS in production and not docker

Third is a redis server
    - Port 6739
    - Used to store session info for a user