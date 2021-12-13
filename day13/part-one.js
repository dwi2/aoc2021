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
    dots.push({x, y});
  }
});

const shiftAndReflect = (foldedLine, onX) => {
  const distance = onX ? maximumX - foldedLine : maximumY - foldedLine
  const diff = onX ? distance - (maximumX / 2) : distance - (maximumY / 2);
  // console.log(distance, diff);
  const newFoldedLine = foldedLine + diff;
  const newDots = [];
  if (onX) {
    dots.forEach(({x,y}) => {
      const dot = {
        x: x + diff,
        y
      };
      if (x > newFoldedLine) {
        dot.x = 2 * newFoldedLine - x;
      }
      // console.log(`(${x}, ${y}) => (${dot.x}, ${dot.y})`);
      newDots.push(dot);
    });

  } else {
    dots.forEach(({x,y}) => {
      const dot = {
        x,
        y: y + diff
      };

      if (y > newFoldedLine) {
        dot.y = 2 * newFoldedLine - y;
      }
      // console.log(`(${x}, ${y}) => (${dot.x}, ${dot.y})`);
      newDots.push(dot);
    });
  }
  return newDots;
};

readInterface.on("close", () => {
  const instruction = foldInstructions[0];
  let newDots;
  if (instruction.axis === 'x') {
    const xFold = instruction.value;
    newDots = shiftAndReflect(xFold, true);
  } else {
    const yFold = instruction.value;
    newDots = shiftAndReflect(yFold, false);
  }
  const uniqueDots = [];
  newDots.forEach(dot => {
    const found = uniqueDots.find(ud => {
      return ud.x === dot.x && ud.y === dot.y;
    });
    if (!found) {
      uniqueDots.push(dot);
    }
  })
  console.log(uniqueDots.length);
});
