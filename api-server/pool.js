const {Pool} = require('pg')

 exports.pool = new Pool({
    host: process.env.PGADDRESS,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database:process.env.PGDATABASE,
    max:20
});