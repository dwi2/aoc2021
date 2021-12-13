const readline = require("readline");
const fs = require("fs");

const readInterface = readline.createInterface({
  input: fs.createReadStream("./input"),
  // output: process.stdout,
  console: false,
});

let endOfDots = false;
const dots = [];
const foldInstructions = [];
let maximumX = 0;
let maximumY = 0;
readInterface.on("line", (line) => {
  if (line.length === 0) {
    endOfDots = true;
    return;
  }

  if (endOfDots) {
    const instructions = line.split(" ");
    const [axis, value] = instructions[2].split("=");
    foldInstructions.push({
      axis,
      value: Number.parseInt(value)
    });
  } else {
    const [x, y] = line.split(",").map(n => Number.parseInt(n));
    if (x > maximumX) {
      maximumX = x;
    }
    if (y > maximumY) {
      maximumY = y;
    }
    dots.push({ x, y });
  }
});

const reflect = (foldedLine, onX) => {
  if (onX) {
    dots.forEach(({ x, y }, index) => {
      if (x > foldedLine) {
        x = 2 * foldedLine - x;
      }

      dots[index] = { x, y };
    });

  } else {
    dots.forEach(({ x, y }, index) => {
      if (y > foldedLine) {
        y = 2 * foldedLine - y;
      }
      dots[index] = { x, y };
    });
  }
};

const print = () => {
  let left = 0; right = 0, top = 0; bottom = 0;
  dots.forEach(dot => {
    if (dot.x < left) {
      left = dot.x;
    }
    if (dot.x > right) {
      right = dot.x;
    }
    if (dot.y < top) {
      top = dot.y;
    }
    if (dot.y > bottom) {
      bottom = dot.y;
    }
  })

  const width = right - left;
  let line = '';
  for (x = 0; x <= width; x += 1) {
    line += '.';
  }
  const graph = [];
  for (y = 0; y <= bottom; y += 1) {
    graph.push(line);
  }

  dots.forEach(dot => {
    const buffer = graph[dot.y].split("");
    buffer.splice(dot.x, 1, '#');
    graph[dot.y] = buffer.join("");
  });

  graph.forEach(line => {
    console.log(line);
  });
};

readInterface.on("close", () => {
  foldInstructions.forEach((instruction, index) => {
    if (instruction.axis === 'x') {
      const xFold = instruction.value;
      reflect(xFold, true);
    } else {
      const yFold = instruction.value;
      reflect(yFold, false);
    }
    const uniqueDots = [];
    dots.forEach(dot => {
      const found = uniqueDots.find(ud => {
        return ud.x === dot.x && ud.y === dot.y;
      });
      if (!found) {
        uniqueDots.push(dot);
      }
    })

    if (index === foldInstructions.length - 1) {
      print();
    }
  });

});
