const mysql = require('mysql');
require('dotenv').config()

const DATABASENAME = "UserRecord"
const TABLENAME = "UserTable"

//Building Connection with SQL Server
const buildCon = mysql.createConnection({
    host: "localhost",
    password: process.env.PASSWORD,    //should be your Password of SQl Server
    user: "root",
})

//Checking Connection
buildCon.connect((err) => {
    if (err) {
        console.log(err.sqlMessage);
    } else {
        buildCon.query(`CREATE DATABASE ${DATABASENAME}`, function (err, result) { //Building Database
            if (err?.sqlMessage.includes("database exists")){   //Checking If DB already Exists or not
                console.log("Database Connected");
                return;
            }
            console.log("Database created");
            var createtable = `CREATE TABLE IF NOT EXISTS ${TABLENAME} (ID int NOT NULL AUTO_INCREMENT,firstName VARCHAR(255), lastName VARCHAR(255),email VARCHAR(255),password VARCHAR(255),mobileNo int,userImage VARCHAR(255),PRIMARY KEY (ID))`; //Creating TAble in DB
             let con=mysql.createConnection({
                host: "localhost",
                password: process.env.PASSWORD,
                user: "root",
                database:DATABASENAME
            })
            con.query(createtable, function (err, result) {
                if (err) throw err;
                console.log("Table created");
            });
            console.log("Database Connected");
        })
    }
});

//Connection With DB and Table
module.exports = mysql.createConnection({
    host: "localhost",
    password: process.env.PASSWORD,
    user: "root",
    database:DATABASENAME
})