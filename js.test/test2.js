function run() {
  console.log("3초후 실행");
}
console.log("시작");
setTimeout(run, 3000); //3000 밀리세컨즈 3초

console.log("끝");

// non - blocking I/O

// 실행결과 시작 끝 하고 3초뒤에 3초후실행 이라는 결과 값 출력 실행순서 이해중요
