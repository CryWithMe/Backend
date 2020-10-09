const {Pool} = require('pg')

 exports.pool = new Pool({
    host: "postgres",
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    max:20
})