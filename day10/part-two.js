const readline = require("readline");
const fs = require("fs");

const readInterface = readline.createInterface({
  input: fs.createReadStream("./input"),
  // output: process.stdout,
  console: false,
});

const SCORE_TABLE = {
  ")": 1,
  "]": 2,
  "}": 3,
  ">": 4,
};
const mappingToComplete = {
  "(": ")",
  "[": "]",
  "{": "}",
  "<": ">",
};
const mapping = {
  ")": "(",
  "]": "[",
  "}": "{",
  ">": "<",
};
const openBrackets = Object.values(mapping);
// const closingBrackets = Object.keys(mapping);

const incompleteLines = [];

readInterface.on("line", (line) => {
  const input = line.split("");

  const stack = [];
  const isCorrupted = input.some((char) => {
    if (openBrackets.includes(char)) {
      stack.push(char);
      return false;
    } else {
      //if (closingBrackets.includes)
      const expected = mapping[char];
      if (stack[stack.length - 1] === expected) {
        stack.pop();
        return false;
      } else {
        // corrupted
        return true;
      }
    }
  });

  if (!isCorrupted && stack.length > 0) {
    incompleteLines.push({
      line,
      stack,
    });
  }
});

readInterface.on("close", () => {
  const scores = [];

  const bracketsToComplete = [];
  incompleteLines.forEach((item) => {
    bracketsToComplete.length = 0;
    while (item.stack.length > 0) {
      const char = item.stack.pop();
      bracketsToComplete.push(mappingToComplete[char]);
    }

    const theScore = bracketsToComplete.reduce((score, char) => {
      return (score = score * 5 + SCORE_TABLE[char]);
    }, 0);
    console.log(`${bracketsToComplete.join("")}: ${theScore}`);
    scores.push(theScore);
  });

  scores.sort((a, b) => a - b);
  console.log(scores[~~(scores.length / 2)]);
});
