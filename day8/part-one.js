const readline = require("readline");
const fs = require("fs");

const readInterface = readline.createInterface({
  input: fs.createReadStream("./input"),
  // output: process.stdout,
  console: false,
});

const uniqueSegments = [2, 3, 4, 7];
let sum = 0;
readInterface.on("line", (line) => {
  const [_, output] = line.split("|").map(s => s.trim());
  const outputSignals = output.split(" ");
  outputSignals.forEach(signal => {
    if (uniqueSegments.includes(signal.length)) {
      sum += 1;
    }
  });

});

readInterface.on("close", () => {
  console.log(sum);
});

