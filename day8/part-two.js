const readline = require("readline");
const fs = require("fs");

const readInterface = readline.createInterface({
  input: fs.createReadStream("./input"),
  // output: process.stdout,
  console: false,
});

const sortString = (str) => {
  return str.split("").sort().join("");
};

const isNine = (unknown, four) => {
  if (unknown.length !== 6) {
    return;
  }

  const unknownArray = unknown.split("");
  const fourArray = four.split("");
  const difference = unknownArray.filter((segment) => {
    return !fourArray.includes(segment);
  });
  return difference.length === 2;
};

const isThree = (unknown, three) => {
  if (unknown.length !== 5) {
    return;
  }
  const unknownArray = unknown.split("");
  const threeArray = three.split("");
  const difference = unknownArray.filter((segment) => {
    return !threeArray.includes(segment);
  });
  return difference.length === 2;
};

const findZeroAndSix = (unknowns, seven) => {
  if (
    unknowns.length !== 2 ||
    unknowns[0].length !== 6 ||
    unknowns[0].length !== 6
  ) {
    return {};
  }
  const unknownA = unknowns[0];
  const unknownB = unknowns[1];
  const unknownAArray = unknownA.split("");
  const sevenArray = seven.split("");

  const differenceA = unknownAArray.filter((segment) => {
    return !sevenArray.includes(segment);
  });

  return differenceA.length === 3
    ? {
        zero: unknownA,
        six: unknownB,
      }
    : {
        zero: unknownB,
        six: unknownA,
      };
};

const findFiveAndTwo = (unknowns, six) => {
  if (
    unknowns.length !== 2 ||
    unknowns[0].length !== 5 ||
    unknowns[1].length !== 5
  ) {
    return {};
  }
  const unknownA = unknowns[0];
  const unknownB = unknowns[1];
  const unknownAArray = unknownA.split("");
  const sixArray = six.split("");
  const differenceA = sixArray.filter((segment) => {
    return !unknownAArray.includes(segment);
  });

  return differenceA.length === 1
    ? {
        five: unknownA,
        two: unknownB,
      }
    : {
        five: unknownB,
        two: unknownA,
      };
};

let sum = 0;
readInterface.on("line", (line) => {
  const [input, output] = line.split("|").map((s) => s.trim());
  const inputSignals = input.split(" ");
  const table = { input: [], output: [] };
  for (let i = 0; i < inputSignals.length; i += 1) {
    table.input[i] = "";
  }
  const unknownInput = [];
  inputSignals.forEach((signal) => {
    const sortedSignal = sortString(signal);
    switch (sortedSignal.length) {
      case 2:
        table.input[1] = sortedSignal;
        break;
      case 3:
        table.input[7] = sortedSignal;
        break;
      case 4:
        table.input[4] = sortedSignal;
        break;
      case 7:
        table.input[8] = sortedSignal;
        break;
      default:
        unknownInput.push(sortedSignal);
    }
  });
  table.output = output
    .split(" ")
    .map((outputSignal) => sortString(outputSignal));

  const lengthOfSix = unknownInput.filter((unknown) => unknown.length === 6);
  const lengthOfFive = unknownInput.filter((unknown) => unknown.length === 5);
  table.input[9] = lengthOfSix.find((unknown) =>
    isNine(unknown, table.input[4])
  );
  table.input[3] = lengthOfFive.find((unknown) =>
    isThree(unknown, table.input[7])
  );

  const remainingSix = lengthOfSix.filter(
    (unknown) => unknown !== table.input[9]
  );
  const remainingFive = lengthOfFive.filter(
    (unknown) => unknown !== table.input[3]
  );

  const { zero, six } = findZeroAndSix(remainingSix, table.input[7]);
  table.input[0] = zero;
  table.input[6] = six;

  const { five, two } = findFiveAndTwo(remainingFive, table.input[6]);
  table.input[5] = five;
  table.input[2] = two;

  const decodedOutput = [];
  table.output.forEach((outputSignal) => {
    const num = table.input.findIndex((elem) => elem === outputSignal);
    if (num > -1) {
      decodedOutput.push(num);
    }
  });
  const num = decodedOutput.reduce((prev, currentDigit) => prev + String(currentDigit), '');
  sum += Number.parseInt(num, 10);
});

readInterface.on("close", () => {
  console.log(sum);
});
