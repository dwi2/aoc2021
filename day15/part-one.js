const readline = require("readline");
const fs = require("fs");

const readInterface = readline.createInterface({
  input: fs.createReadStream("./input"),
  // output: process.stdout,
  console: false,
});

const riskLevels = [];
readInterface.on("line", (line) => {
  riskLevels.push(line);
});

const inMap = (x, y) => {
  if (x < 0 || x >= riskLevels[0].length || y < 0 || y >= riskLevels.length) {
    return false;
  }
  return true;
};

const isDestination = (x, y) => {
  return x === riskLevels[0].length - 1 && y === riskLevels.length - 1;
};

const getRisk = (x, y) => {
  if (!inMap(x, y)) {
    return Number.MAX_SAFE_INTEGER;
  }
  return Number.parseInt(riskLevels[y][x]);
};

const findNeighbors = (x, y) => {
  return [
    {
      x: x + 1,
      y: y,
    },
    {
      x: x,
      y: y + 1,
    },
  ];
};

const REPORT_PERIOD = 200;
let numberOfPaths = 0;

let minimumRisk = Number.MAX_SAFE_INTEGER;
const traverse = (current, sum) => {
  if (!inMap(current)) {
    return Number.MAX_SAFE_INTEGER;
  }

  const currentRisk = getRisk(current.x, current.y);
  if (isDestination(current.x, current.y)) {
    // console.log(`reach (${current.x}, ${current.y}), ${currentRisk}`);
    if (sum < minimumRisk) {
      minimumRisk = sum;
    }
    numberOfPaths += 1;

    if (numberOfPaths % REPORT_PERIOD === 0) {
      console.log(
        `numberOfPaths: ${numberOfPaths}, minimumRisk: ${minimumRisk}`
      );
    }
    return currentRisk;
  }

  if (sum >= minimumRisk || currentRisk >= minimumRisk) {
    return Number.MAX_SAFE_INTEGER;
  }

  sum += currentRisk;
  const [right, down] = findNeighbors(current.x, current.y);

  const rightRisk = inMap(right.x, right.y)
    ? traverse(right, sum)
    : Number.MAX_SAFE_INTEGER;
  const downRisk = inMap(down.x, down.y)
    ? traverse(down, sum)
    : Number.MAX_SAFE_INTEGER;
  // console.log(`traversing (${current.x}, ${current.y}), ${currentRisk}`);
  // console.log(`rightRisk: ${rightRisk}, downRisk: ${downRisk}`);

  if (downRisk < rightRisk) {
    // console.log(`downRisk = ${downRisk}`);
    return currentRisk + downRisk;
  } else if (rightRisk < downRisk) {
    // console.log(`rightRisk = ${rightRisk}`);
    return currentRisk + rightRisk;
  } else {
    return Number.MAX_SAFE_INTEGER;
  }
};

readInterface.on("close", () => {
  const start = {
    x: 0,
    y: 0,
    risk: 0,
  };

  traverse(start, 0);
  console.log(minimumRisk, numberOfPaths);
});
