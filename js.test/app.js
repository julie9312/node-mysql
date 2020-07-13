//파일 하나 만들기 
const fs = require('fs')
// validator 패키지 가져다 쓰기 
const validator = require('validator')

let ret = validator.isEmail('abc@naver.com')
ret = validator.isURL('http://naver.com')
console.log(ret)

// 1. chalk 라는 패키지를 설치하세요. 
// 2. app.js 파일에서 로딩하세요
//3. 문자열로 "Success!" 라고 출력하고 녹색으로 출력
//4. 3번의 문제에 추가하여 bold 체로 출력
const chalk = require('chalk');
 
console.log(chalk.green.bold('Success'));





//fs.writeFileSync('notes.txt', '안녕하세요')

//1. appendFileSync 라는 함수를 이용해서 
//2. note.txt 파일에 , 새로운 내용을 추가하세요. 
//3. 실행하여 결과를 확인

fs.appendFileSync('notes.txt', '환영합니다')
fs.appendFileSync('note.txt', "\n반갑습니다.")