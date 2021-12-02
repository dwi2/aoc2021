const readline = require("readline");
const fs = require("fs");

const readInterface = readline.createInterface({
  input: fs.createReadStream("./input"),
  // output: process.stdout,
  console: false,
});

const buffer = [];
const windows = [];
const createWindow = (m) => {
  return {
    numberOfMeasurement: 1,
    sum: m,
  };
};

const startTime = process.hrtime();

let count = 0;
readInterface.on("line", (line) => {
  count += 1;
  const measurement = Number.parseInt(line);
  if (typeof measurement === "number" && !Number.isNaN(measurement)) {
    buffer.forEach((window) => {
      if (window.numberOfMeasurement >= 3) {
        return;
      }
      window.numberOfMeasurement += 1;
      window.sum += measurement;
    });

    while (
      buffer.length > 0 &&
      buffer[0] &&
      buffer[0].numberOfMeasurement >= 3
    ) {
      const head = buffer.shift();
      windows.push(head);
    }

    const newWindow = createWindow(measurement);
    buffer.push(newWindow);
  }
});

readInterface.on("close", () => {
  let prevWindow;
  let increaseCount = 0;

  windows.forEach((window) => {
    if (
      window.numberOfMeasurement === 3 &&
      prevWindow &&
      prevWindow.numberOfMeasurement === 3 &&
      window.sum > prevWindow.sum
    ) {
      increaseCount += 1;
    }
    prevWindow = window;
  });

  console.log(increaseCount);


  const elapsed = process.hrtime(startTime)[1] / 1000000;
  console.log(`${elapsed.toFixed(3)}ms`);
});
