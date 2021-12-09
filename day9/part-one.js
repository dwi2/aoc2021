const readline = require("readline");
const fs = require("fs");

const readInterface = readline.createInterface({
  input: fs.createReadStream("./input"),
  // output: process.stdout,
  console: false,
});

const heightMap = {};
let lineNumber = 0;
let width = 0;
readInterface.on("line", (line) => {
  if (!width) {
    width = line.length;
  }
  const heights = line.split("").map((h) => Number.parseInt(h));
  const y = lineNumber;
  heights.forEach((h, x) => {
    heightMap[`${x}-${y}`] = h;
  });
  lineNumber += 1;
});

const isValidHeight = (value) => {
  return typeof value === "number";
};

const isLowPoint = (x, y) => {
  const thisHeight = heightMap[`${x}-${y}`];
  const right = isValidHeight(heightMap[`${x + 1}-${y}`])
    ? heightMap[`${x + 1}-${y}`]
    : 99;
  const left = isValidHeight(heightMap[`${x - 1}-${y}`])
    ? heightMap[`${x - 1}-${y}`]
    : 99;
  const down = isValidHeight(heightMap[`${x}-${y + 1}`])
    ? heightMap[`${x}-${y + 1}`]
    : 99;
  const up = isValidHeight(heightMap[`${x}-${y - 1}`])
    ? heightMap[`${x}-${y - 1}`]
    : 99;
  return (
    thisHeight < right &&
    thisHeight < down &&
    thisHeight < left &&
    thisHeight < up
  );
};

readInterface.on("close", () => {
  // console.log(heightMap);
  const lowPoints = [];
  for (let x = 0; x < width; x += 1) {
    for (let y = 0; y < lineNumber; y += 1) {
      const value = heightMap[`${x}-${y}`];
      if (isLowPoint(x, y)) {
        // console.log(`found (${x}, ${y}): ${value}`);
        lowPoints.push(value);
      }
    }
  }

  const result = lowPoints.reduce((prev, curr) => {
    return prev + (curr + 1);
  }, 0);
  console.log(lowPoints, result);
});
