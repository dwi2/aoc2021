const readline = require("readline");
const fs = require("fs");

const readInterface = readline.createInterface({
  input: fs.createReadStream("./input"),
  // output: process.stdout,
  console: false,
});

let polymerTemplate = "";
let firstLine;
const expantionRules = {};
readInterface.on("line", (line) => {
  if (line.length > 0 && line.indexOf("->") === -1) {
    polymerTemplate = line;
    if (!firstLine) {
      firstLine = line;
    }
  } else if (line.length > 0) {
    const [key, value] = line.split("->").map((text) => text.trim());
    expantionRules[key] = [key[0] + value, value + key[1]];
  }
});

let polymerState = {};
let head;
const runOneStep = () => {
  const newState = {};
  Object.keys(polymerState).forEach(state => {
    if (polymerState[state] > 0 && expantionRules[state]) {
      if (!newState[expantionRules[state][0]]) {
        newState[expantionRules[state][0]] = 0;
      }
      if (!newState[expantionRules[state][1]]) {
        newState[expantionRules[state][1]] = 0;
      }
      newState[expantionRules[state][0]] += polymerState[state];
      newState[expantionRules[state][1]] += polymerState[state];
    }
  });
  polymerState = newState;
  head = expantionRules[head][0];
};

readInterface.on("close", () => {
  const STEP_LIMIT = 40;

  for (let i = 0; i < polymerTemplate.length - 1; i += 1) {
    const pair = polymerTemplate.substring(i, i + 2);
    if (!polymerState[pair]) {
      polymerState[pair] = 0;
    }
    polymerState[pair] += 1;
  }
  head = polymerTemplate.substring(0, 2);

  for (let step = 0; step < STEP_LIMIT; step += 1) {
    runOneStep();
  }

  const charCount = {};
  Object.keys(polymerState).forEach(pair => {
    if (!charCount[pair[1]]) {
      charCount[pair[1]] = 0;
    }
    charCount[pair[1]] += polymerState[pair];
  });

  if (!charCount[head[0]]) {
    charCount[head[0]] = 0;
  }
  charCount[head[0]] += 1;

  console.log(charCount);
});
