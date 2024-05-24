const mysql2 = require('mysql2');

const connection = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'fresh_chef_db'
});

connection.connect((error) => {
    if (error) {
        return console.log(error.message);
    } else {
        console.log('Connection success');
    }
});

module.exports = connection;
