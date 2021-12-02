const readline = require("readline");
const fs = require("fs");

const readInterface = readline.createInterface({
  input: fs.createReadStream("./input"),
  console: false,
});

let previousMeasurement;
let increaseCount = 0;
readInterface.on("line", (line) => {
  const measurement = Number.parseInt(line);
  if (
    typeof previousMeasurement === "number" &&
    typeof measurement === "number" &&
    !Number.isNaN(measurement) &&
    measurement > previousMeasurement
  ) {
    increaseCount += 1;
  }

  previousMeasurement = measurement;
});

readInterface.on("close", () => {
  console.log(increaseCount);
});

