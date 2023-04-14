const mysql = require('mysql');

const con = mysql.createConnection({
    // host: 'localhost',
    // user: 'root',
    // password: '',
    // port:3308,
    // database: 'firstcruddb'
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    port: process.env.dbport,
    database: process.env.database
})

con.connect( err => {
    if(err) throw err
    console.log('Successfully connected with database') 
});

module.exports = con;