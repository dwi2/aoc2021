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
  const median = ~~(crabs.length / 2);
  console.log(median, crabs[median]);
  const alignPosition = crabs[median];
  const result = crabs.reduce((prev, current, currentIndex) => {
    const movement = current - alignPosition;
    return prev + ((movement < 0) ? movement * -1 : movement);
  }, 0);
  console.log(result);
});

