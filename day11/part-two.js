const readline = require("readline");
const fs = require("fs");

const readInterface = readline.createInterface({
  input: fs.createReadStream("./input"),
  // output: process.stdout,
  console: false,
});

const octopuses = [];
readInterface.on("line", (line) => {
  octopuses.push(line);
});

const print = () => {
  console.log("===");
  octopuses.forEach(line => {
    console.log(line);
  });
  
};

const queueOfFlash = [];
const flash = (x, y) => {
  const X_LIMIT = octopuses[0].length;
  const Y_LIMIT = octopuses.length;
  const adjacents = [
    {
      x: x - 1,
      y: y - 1,
    },
    {
      x: x - 1,
      y: y,
    },
    {
      x: x - 1,
      y: y + 1,
    },
    {
      x: x,
      y: y - 1,
    },
    {
      x: x,
      y: y + 1,
    },
    {
      x: x + 1,
      y: y - 1,
    },
    {
      x: x + 1,
      y: y,
    },
    {
      x: x + 1,
      y: y + 1,
    },
  ];

  adjacents.forEach(coord => {
    if (coord.x >= 0 && coord.x < X_LIMIT && coord.y >= 0 && coord.y < Y_LIMIT) {
      const energy = octopuses[coord.y][coord.x];
      if (energy !== '0') {
        const newValue = String((Number.parseInt(energy) + 1) % 10);
        if (newValue === '0') {
          // console.log(`(${coord.x}, ${coord.y}) flashes`);
          queueOfFlash.push({
            x: coord.x,
            y: coord.y
          })
        }
        const line = octopuses[coord.y].split("");
        line.splice(coord.x, 1, newValue);
        octopuses[coord.y] = line.join("");
      }
    }
  });

};

readInterface.on("close", () => {
  const STEP_LIMIT = 1000;
  const total = octopuses.length * octopuses[0].length;
  console.log(total);

  let theStep;
  for (let step = 0; step < STEP_LIMIT; step += 1) {
    let flashInOneStep = 0;
    octopuses.forEach((line, y) => {
      const states = line.split("").map(n => Number.parseInt(n));
      states.forEach((energy, x) => {
        states[x] = (energy + 1) % 10;
        if (states[x] === 0) {
          queueOfFlash.push({ x, y });
        }
      });
      octopuses[y] = states.map(n => String(n)).join("");
    });

    while (queueOfFlash.length > 0) {
      const toFlash = queueOfFlash.pop();
      flash(toFlash.x, toFlash.y);
      flashInOneStep += 1;
    }
    print();
    if (flashInOneStep === total) {
      console.log(`sync at ${step}`);
      theStep = step;
      break;
    }
  }

  console.log(theStep + 1);
});
