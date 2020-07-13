const connection = require('./mysql_connection.js')


let query = 'select * from students'

query = 'select s.first_name, p.title, p.grade from students as\
 s join papers as p on s.id = p.student_id;'

connection.query(query, function(error, results, fields){

    console.log(results)
})

connection.end()

