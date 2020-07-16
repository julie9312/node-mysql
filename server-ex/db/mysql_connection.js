const mysql = require('mysql')

const connection = mysql.createConnection({

    host     : 'database-1.cjcxvajze0z5.ap-northeast-2.rds.amazonaws.com',
    user     : 'node_user',
    password : 'node1234test',
    database : 'my_test'

})

module.exports = connection

