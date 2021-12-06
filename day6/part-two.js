const readline = require("readline");
const fs = require("fs");

const readInterface = readline.createInterface({
  input: fs.createReadStream("./input"),
  // output: process.stdout,
  console: false,
});


const fishes = [];
readInterface.on("line", (line) => {
  fishes.push(...line.split(",").map(n => Number.parseInt(n)));
});

const NEW_FISH_INDEX = 8;
const RESET_FISH_INDEX = 6;
const numberOfFishesInEachState = [0, 0, 0, 0, 0, 0, 0, 0, 0]
readInterface.on("close", () => {
  const DAYS_PASSED = 256;

  fishes.forEach(fish => {
    numberOfFishesInEachState[fish] += 1;
  });

  for (day = 0; day < DAYS_PASSED; day += 1) {
    const head = numberOfFishesInEachState.shift();
    if (head > 0) {
      numberOfFishesInEachState[NEW_FISH_INDEX] = head;
      numberOfFishesInEachState[RESET_FISH_INDEX] += head;
    } else {
      numberOfFishesInEachState.push(0);
    }
  }

  // console.log(numberOfFishesInEachState);
  const result = numberOfFishesInEachState.reduce((prev, current) => {
    return prev + current;
  }, 0);
  console.log(result);
});

