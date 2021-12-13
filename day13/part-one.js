const readline = require("readline");
const fs = require("fs");

const readInterface = readline.createInterface({
  input: fs.createReadStream("./input"),
  // output: process.stdout,
  console: false,
});

let endOfDots = false;
const dots = [];
const foldInstructions = [];
let maximumX = 0;
let maximumY = 0;
readInterface.on("line", (line) => {
  if (line.length === 0) {
    endOfDots = true;
    return;
  }

  if (endOfDots) {
    const instructions = line.split(" ");
    const [axis, value] = instructions[2].split("=");
    foldInstructions.push({
      axis,
      value: Number.parseInt(value)
    });
  } else {
    const [x, y] = line.split(",").map(n => Number.parseInt(n));
    if (x > maximumX) {
      maximumX = x;
    }
    if (y > maximumY) {
      maximumY = y;
    }
    dots.push({ x, y });
  }
});

const reflect = (foldedLine, onX) => {
  if (onX) {
    dots.forEach(({ x, y }, index) => {
      if (x > foldedLine) {
        x = 2 * foldedLine - x;
      }
      dots[index] = { x, y };
    });

  } else {
    dots.forEach(({ x, y }, index) => {
      if (y > foldedLine) {
        y = 2 * foldedLine - y;
      }
      dots[index] = { x, y };
    });
  }
};

readInterface.on("close", () => {
  instruction = foldInstructions[0];
  if (instruction.axis === 'x') {
    const xFold = instruction.value;
    reflect(xFold, true);
  } else {
    const yFold = instruction.value;
    reflect(yFold, false);
  }
  const uniqueDots = [];
  dots.forEach(dot => {
    const found = uniqueDots.find(ud => {
      return ud.x === dot.x && ud.y === dot.y;
    });
    if (!found) {
      uniqueDots.push(dot);
    }
  })

  console.log(uniqueDots.length);

});
