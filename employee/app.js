// 네트워크를 통해서 다른 서버의 api를 호출하기 위해서
const request = require('postman-request');

const connection = require('./mysql_connection');

const baseUrl = 'http://dummy.restapiexample.com'

let path = '/api/v1/employees'

request.get( {url: baseUrl+path, json:true} , 
    function(error, response, body){
       
        let array = body.data

        let query = 'insert into employee (name, salary, age) values ? '
        // ? 에 들어갈 데이터는 [] 로 만들어야 한다. 
        let data = []
        for(let i = 0; i < array.length; i++){
            data.push( [ array[i].employee_name,
                     array[i].employee_salary, 
                     array[i].employee_age] )

        }
         console.log(data)
         // 아래 [data] 의 뜻은, 첫번째 물음표? 가 data라는 뜻이다. 
         connection.query(query, [data] , function(error, results, fields){
        })
         connection.end()

   });

