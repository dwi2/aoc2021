const readline = require("readline");
const fs = require("fs");

const readInterface = readline.createInterface({
  input: fs.createReadStream("./input"),
  // output: process.stdout,
  console: false,
});


let lineCount = 0;
let digitSum = [];
let digit = 0;
readInterface.on("line", (line) => {
  if (lineCount === 0) {
    digit = line.length;
    for (let k = 0; k < digit; k += 1) {
      digitSum.push(0);
    }
  }
  lineCount += 1;
  for (let i = 0; i < digit; i += 1) {
    digitSum[i] += line[i] === '1' ? 1 : 0;
  }
});

readInterface.on("close", () => {
  console.log(digitSum, lineCount);
  const gammaArray = [];
  const epsilonArray = []
  for (let i = 0; i < digit; i += 1) {
    if (digitSum[i] >= (lineCount / 2)) {
      gammaArray[i] = '1';
      epsilonArray[i] = '0';
    } else {
      gammaArray[i] = '0';
      epsilonArray[i] = '1';
    }
  }
  const gamma = Number.parseInt(gammaArray.join(''), 2);
  const epsilon = Number.parseInt(epsilonArray.join(''), 2);
  console.log(gammaArray.join(''), gamma);
  console.log(epsilonArray.join(''), epsilon);

  console.log(gamma * epsilon);
});

