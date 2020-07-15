const request = require('postman-request');

// request('http://www.google.com', function (error, response, body) {
//   console.log('error:', error); // Print the error if one occurred
//   console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//   console.log('body:', body); // Print the HTML for the Google homepage.
// });

const baseUrl = 'http://api.weatherstack.com/'
let queryUrl = baseUrl+
'current?access_key=dc0ed37480bfb7d60f0a61467701d0a1' + '&query='

let query = 'seoul'

request.get( { url : queryUrl + query, json:true}, function(error, response, body){
  console.log(response.statusCode)
  //console.log(body)
  //온도만 출력  
  console.log(body.current.temperature) 
})