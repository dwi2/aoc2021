const readline = require("readline");
const fs = require("fs");

const readInterface = readline.createInterface({
  input: fs.createReadStream("./input"),
  // output: process.stdout,
  console: false,
});

let polymerTemplate = "";
const insertionRules = {};
readInterface.on("line", (line) => {
  if (line.length > 0 && line.indexOf("->") === -1) {
    polymerTemplate = line;
  } else if (line.length > 0) {
    const [key, value] = line.split("->").map((text) => text.trim());
    insertionRules[key] = value;
  }
});

const runOneStep = (polymer) => {
  const newBorn = [];
  for (let i = 0; i < polymer.length - 1; i += 1) {
    const pair = polymer.slice(i, i + 2).join("");
    if (insertionRules[pair]) {
      newBorn.unshift({
        char: insertionRules[pair],
        pos: i + 1,
      });
    }
  }

  newBorn.forEach((entry) => {
    polymer.splice(entry.pos, 0, entry.char);
  });
  return polymer;
};

readInterface.on("close", () => {
  const STEP_LIMIT = 10;
  let polymer = polymerTemplate.split("");
  for (let i = 0; i < STEP_LIMIT; i += 1) {
    polymer = runOneStep(polymer);
  }

  const characterCount = {};
  let mostCommon;
  let leastCommon;
  for (let c = 0; c < polymer.length; c += 1) {
    const char = polymer[c];
    if (!characterCount[char]) {
      characterCount[char] = 0;
    }
    characterCount[char] += 1;
    if (!mostCommon) {
      mostCommon = {
        char: char,
        count: characterCount[char],
      };
    } else {
      if (characterCount[char] > mostCommon.count) {
        mostCommon = {
          char: char,
          count: characterCount[char],
        };
      }
    }
  }

  Object.entries(characterCount).forEach(([k, v]) => {
    if (!leastCommon) {
      leastCommon = {
        char: k,
        count: v,
      };
    } else {
      if (v < leastCommon.count) {
        leastCommon = {
          char: k,
          count: v,
        };
      }
    }
  });

  console.log(mostCommon, leastCommon);
  console.log(mostCommon.count - leastCommon.count);
});
