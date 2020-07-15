const employee = require('employee')

const baseUrl = 'http://dummy.restapiexample.com/api/v1/employees'

let queryUrl = baseUrl+ 'http://dummy.restapiexample.com/api/v1/employees' + '&query='


    connection.query(query, function(error, results, fields){

        console.log(results)
    })
    
    connection.end()
    