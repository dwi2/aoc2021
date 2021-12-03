const readline = require("readline");
const fs = require("fs");

const readInterface = readline.createInterface({
  input: fs.createReadStream("./input"),
  // output: process.stdout,
  console: false,
});

const searching = (reports, pickOnes = false) => {
  const digitLength = reports[0].length;
  let sumOfTheDigit = 0;
  let rating;
  for (let digitPointer = 0; digitPointer < digitLength; digitPointer += 1) {
    const ones = [];
    const zeros = [];

    reports.forEach(report => {
      if (report[digitPointer] === '1') {
        sumOfTheDigit += 1;
        ones.push(report);
      } else {
        zeros.push(report);
      }
    });
    if (sumOfTheDigit >= (reports.length / 2)) {
      reports = pickOnes ? ones : zeros;
    } else {
      reports = pickOnes ? zeros : ones;
    }
    sumOfTheDigit = 0;

    if (reports.length === 1) {
      rating = Number.parseInt(reports[0], 2);
      break;
    }    
  }

  return rating;
};

const reportsForOxygen = [];
const reportsForCO2 = [];
readInterface.on("line", (line) => {
  reportsForOxygen.push(line);
  reportsForCO2.push(line);
});

readInterface.on("close", () => {
  const oxygenRating = searching(reportsForOxygen, true);
  const co2Rating = searching(reportsForCO2, false);

  console.log(oxygenRating * co2Rating);
});

