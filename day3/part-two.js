const readline = require("readline");
const fs = require("fs");

const readInterface = readline.createInterface({
  input: fs.createReadStream("./input"),
  // output: process.stdout,
  console: false,
});


const reportsForOxygen = [];
const reportsForCO2 = [];
let lineCount = 0;
readInterface.on("line", (line) => {
  reportsForOxygen.push(line);
  reportsForCO2.push(line);
  
  lineCount += 1;
});

readInterface.on("close", () => {
  const digitLength = reportsForOxygen[0].length;

  let oxygenRating, co2Rating;

  let reports = reportsForOxygen;
  let sumOfTheDigit = 0;
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
      reports = ones;
    } else {
      reports = zeros;
    }
    sumOfTheDigit = 0;

    if (reports.length === 1) {
      oxygenRating = Number.parseInt(reports[0], 2);
      break;
    }    
  }

  
  reports = reportsForCO2;
  sumOfTheDigit = 0;
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
      reports = zeros;
    } else {
      reports = ones;
    }
    sumOfTheDigit = 0;

    if (reports.length === 1) {
      co2Rating = Number.parseInt(reports[0], 2);
      break;
    }
  }

  console.log(oxygenRating, co2Rating);
  console.log(oxygenRating * co2Rating);
});

