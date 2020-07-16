const request = require('postman-request');

// 1. 화곡역의 위도, 경도를 뽑아서 출력. 
const baseurl = 'https://api.mapbox.com/geocoding/v5/mapbox.places/화곡역.json?access_token=pk.eyJ1IjoianVsaWU5MzEyIiwiYSI6ImNrY214emE2ZDA1eWozMGx0MnFlOWJmMm0ifQ.vxYn3uCgqjf8dXst2SlBBA'


const encoded = encodeURI(baseurl);


request.get( {url:encoded, json:true}, 
    function(error, response, body){
        console.log(body.features[0].center[1])
        console.log(body.features[0].center[0]) 

        })
      
