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

const NEW_FISH_STATE = 8;
const RESET_FISH_STATE = 6;
readInterface.on("close", () => {
  
  for (let day = 1; day <= 80; day += 1) {
    const newBornFishes = [];
    fishes.forEach((state, index) => {
      if (state === 0) {
        fishes[index] = RESET_FISH_STATE;
        newBornFishes.push(NEW_FISH_STATE);
      } else {
        fishes[index] -= 1;
      }
    });
    fishes.splice(fishes.length, 0, ...newBornFishes);
    // debug
    // console.log(fishes.join(','));
  }
  console.log(fishes.length);
});

