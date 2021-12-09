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

const isOnMap = (x, y) => {
  return !(x < 0 || y < 0 || x >= width || y >= lineNumber);
};

const isInBasin = (x, y) => {
  if (!isOnMap(x, y)) {
    return false;
  }

  const height = heightMap[`${x}-${y}`];
  return height < 9;
};

const traverse = (x, y, buffer, unvisitedPoints) => {
  const point = `${x}-${y}`;
  if (!isOnMap(x, y) || !unvisitedPoints.includes(point)) {
    return true;
  }
  const leftPoint = `${x - 1}-${y}`;
  const rightPoint = `${x + 1}-${y}`;
  const upPoint = `${x}-${y - 1}`;
  const downPoint = `${x}-${y + 1}`;

  unvisitedPoints.splice(unvisitedPoints.indexOf(point), 1);

  if (isInBasin(x, y)) {
    buffer.push(point);
  } else {
    return true;
  }

  let leftDone = true,
    rightDone = true,
    upDone = true,
    downDone = true;
  if (x - 1 >= 0 && unvisitedPoints.includes(leftPoint)) {
    leftDone = traverse(x - 1, y, buffer, unvisitedPoints);
  }

  if (unvisitedPoints.includes(rightPoint)) {
    rightDone = traverse(x + 1, y, buffer, unvisitedPoints);
  }

  if (y - 1 >= 0 && unvisitedPoints.includes(upPoint)) {
    upDone = traverse(x, y - 1, buffer, unvisitedPoints);
  }

  if (unvisitedPoints.includes(downPoint)) {
    downDone = traverse(x, y + 1, buffer, unvisitedPoints);
  }

  return Boolean(leftDone && rightDone && upDone && downDone);
};

readInterface.on("close", () => {
  const pointsToBeTraversed = Object.keys(heightMap);
  const pointsInBasins = [];
  const basinSizes = [];

  while (pointsToBeTraversed.length > 0) {
    const point = pointsToBeTraversed[0];
    const [x, y] = point.split("-").map((i) => Number.parseInt(i));
    const cannotGoFurther = traverse(x, y, pointsInBasins, pointsToBeTraversed);
    if (cannotGoFurther) {
      basinSizes.push(pointsInBasins.length);
      pointsInBasins.length = 0;
    }
  }

  basinSizes.sort((a,b) => {
    return b - a;
  });
  // console.log(basinSizes);

  let topThreeCounter = 0;
  const result = basinSizes.reduce((prev, curr) => {
    if (curr > 0 && topThreeCounter < 3) {
      topThreeCounter += 1;
      return prev * curr;
    }
    return prev;
  }, 1);
  console.log(result);
});
