const mysql = require('mysql');
require('dotenv').config()

const pool = mysql.createPool({
    connectionLimit : 100, 
    host     : 'localhost',
    user     : 'root',
    password : process.env.PASSWORD,
    database : process.env.DATABASENAME,
});

pool.getConnection((err)=>{
    if (err) throw err;
    else{
        console.log("Database is connected")
    }
})

module.exports=pool;