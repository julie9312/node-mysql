//파일 하나 만들기 
const fs = require('fs')
//fs.writeFileSync('notes.txt', '안녕하세요')

//1. appendFileSync 라는 함수를 이용해서 
//2. note.txt 파일에 , 새로운 내용을 추가하세요. 
//3. 실행하여 결과를 확인

fs.appendFileSync('notes.txt', '환영합니다')
fs.appendFileSync('note.txt', "\n반갑습니다.")