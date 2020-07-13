console.log('utils.js called')
//Json 형식으로 
module.exports = {
  name = 'Mike',

  add = function(a, b){
    return a + b
   },

 minus = function(a, b){
    return a - b
   }
}
// 일반 사용방식 (위 의 JSON과 비교해보자 / 두개 다 잘 씀)
// const name = 'Mike'
// const add = function (a, b){
//     return a + b}
// const minus = function (a, b){
//     return a -b}
// }
// module.exports = {name, add, minus}

// name을 노출시켜 줘야, 다른 파일에서 받을 수 있다. 
// 단일 노출은 module.exports = name 
// 여러개를 노출 시켜주고 싶을때 

// module.exports = {name, add, minus}

