const connection = require('./mysql_connection.js')


let query = 'select * from students'

query = 'select first_name, title, grade from students as s  \
join papers as p on p.student_id = s.id order by grade desc;'

query = 'select first_name, ifnull(title, "Missing"), ifnull(grade,0) \ from students as s \
        left join papers as p \
        on p.student_id = s.id;'

    
query = 'select first_name, ifnull(title, "Missing"), ifnull(grade,0) \ from students as s \
left join papers as p  \
on p.student_id = s.id;'

query = 'select first_name, avg(grade) as average \
from students as s \
left join papers as p on p.student_id = s.id \
group by first_name order by average desc;'

connection.query(query, function(error, results, fields){

    console.log(results)
})

connection.end()

