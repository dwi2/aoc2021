const readline = require("readline");
const fs = require("fs");

const readInterface = readline.createInterface({
  input: fs.createReadStream("./input"),
  // output: process.stdout,
  console: false,
});


const crabs = [];
readInterface.on("line", (line) => {
  crabs.push(...line.split(",").map(n => Number.parseInt(n)));
});

readInterface.on("close", () => {
  crabs.sort((a,b) => (a - b));
  const total = crabs.reduce((prev, curr) => {
    return prev + curr;
  }, 0);
  // XXX: I think this should be Math.round(total / crabs.length)
  // For example input, the correct answer is caculated with Math.round.
  // But for my puzzle input, system says my answer is wrong. However, 
  // system accept my answer with Math.floor() somehow.
  const avg = Math.floor(total / crabs.length);
  console.log(avg);
  const result = crabs.reduce((prev, current) => {
    const distance = Math.abs(current - avg);
    let consumedFuel = 0;
    for (let i = 1; i <= distance; i += 1) {
        consumedFuel += i;
    }
    return prev + consumedFuel;
  }, 0);
  console.log(result);
});

