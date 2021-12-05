const readline = require("readline");
const fs = require("fs");

const readInterface = readline.createInterface({
  input: fs.createReadStream("./input"),
  // output: process.stdout,
  console: false,
});


const vents = [];
readInterface.on("line", (line) => {
  const [start, end] = line.split(' -> ');
  const [startX, startY] = start.split(',').map(n => Number.parseInt(n));
  const [endX, endY] = end.split(',').map(n => Number.parseInt(n));
  let direction;
  if (startX === endX) {
    direction = endY > startY ? 'down' : 'up';
  } else if (startY === endY) {
    direction = endX > startX ? 'right' : 'left';
  } else {
    direction = endX > startX ? 'right' : 'left';
    direction += endY > startY ? '-down': '-up';
  }
  vents.push({startX, startY, endX, endY, direction});
});

readInterface.on("close", () => {
 
  const diagramInText = {};

  const marking = (position) => {
    if (!diagramInText[position]) {
      diagramInText[position] = 0
    }
    diagramInText[position] += 1;
  }
  vents.forEach(vent => {
    switch (vent.direction) {
      case 'down':
        for (let i = vent.startY; i <= vent.endY; i += 1) {
          const position = `${vent.startX}_${i}`;
          marking(position);
        }
        break;
      case 'up':
        for (let i = vent.startY; i >= vent.endY; i -= 1) {
          const position = `${vent.startX}_${i}`;
          marking(position);
        }
        break;
      case 'right':
        for (let i = vent.startX; i <= vent.endX; i += 1) {
          const position = `${i}_${vent.startY}`;
          marking(position);
        }
        break;
      case 'left':
        for (let i = vent.startX; i >= vent.endX; i -= 1) {
          const position = `${i}_${vent.startY}`;
          marking(position);
        }
        break;
      case 'right-down':
        for (let x = vent.startX, y = vent.startY; x <= vent.endX && y <= vent.endY; x += 1, y += 1) {
          const position = `${x}_${y}`;
          marking(position);
        }
        break;
      case 'right-up':
        for (let x = vent.startX, y = vent.startY; x <= vent.endX && y >= vent.endY; x += 1, y -= 1) {
          const position = `${x}_${y}`;
          marking(position);
        }
        break;
      case 'left-down':
        for (let x = vent.startX, y = vent.startY; x >= vent.endX && y <= vent.endY; x -= 1, y += 1) {
          const position = `${x}_${y}`;
          marking(position);
        }
        break;
      case 'left-up':
        for (let x = vent.startX, y = vent.startY; x >= vent.endX && y >= vent.endY; x -= 1, y -= 1) {
          const position = `${x}_${y}`;
          marking(position);
        }
        break;
      default:
        break;
    }
  });

  const moreThanTwo = Object.values(diagramInText).filter(count => (count >= 2));
  console.log(moreThanTwo.length);
});

