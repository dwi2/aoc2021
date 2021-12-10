const readline = require("readline");
const fs = require("fs");

const readInterface = readline.createInterface({
  input: fs.createReadStream("./input"),
  // output: process.stdout,
  console: false,
});

const SCORE_TABLE = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137
};

let score = 0;
readInterface.on("line", (line) => {
  const input = line.split("");
  const mapping = {
    ')': '(',
    ']': '[',
    '}': '{',
    '>': '<'
  }
  const openBrackets= Object.values(mapping);
  // const closingBrackets = Object.keys(mapping);
  const stack = [];
  const isCorrupted = input.some(char => {
    if (openBrackets.includes(char)) {
      stack.push(char);
      return false;
    } else { //if (closingBrackets.includes)
      const expected = mapping[char];
      if (stack[stack.length - 1] === expected) {
        stack.pop();
        return false;
      } else {
        // console.log('corrupted');
        score += SCORE_TABLE[char];
        return true;
      }
    }
  });
});

readInterface.on("close", () => {
  console.log(score);
});
