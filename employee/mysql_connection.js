//mysql db 에 접속할수 있는 커넥션을 여기서 하나 만들어 놓고 
// 다른 파일에서 가져다 쓸 수 있게 한다. 

const mysql = require('mysql')

const connection = mysql.createConnection(
{
    host     : 'database-1.cjcxvajze0z5.ap-northeast-2.rds.amazonaws.com',
    user     : 'node_user',
    password : 'node1234test',
    database : 'my_test'
}
)
// 다른 파일에서도 aws 사용할수 있게 
module.exports = connection