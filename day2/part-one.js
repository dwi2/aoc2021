const readline = require("readline");
const fs = require("fs");

const readInterface = readline.createInterface({
  input: fs.createReadStream("./input"),
  // output: process.stdout,
  console: false,
});

let position = 0;
let depth = 0;
readInterface.on("line", (step) => {
  const [instruction, unit, ...idontknow] = step.split(" ");
  const unitInNumber = Number.parseInt(unit);
  switch (instruction) {
    case 'forward':
      position += unitInNumber;
      break;
    case 'down':
      depth += unitInNumber;
      break;
    case 'up':
      depth -= unitInNumber;
      break;
    default:
      console.log('WTF?!');
      break;
  }
});

readInterface.on("close", () => {
  console.log(position * depth);
});

