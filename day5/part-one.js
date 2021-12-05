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
  if (startX === endX) {
    vents.push({
      startX,
      startY,
      endX,
      endY,
      direction: endY > startY ? 'down' : 'up'
    });
  }
  else if (startY === endY) {
    vents.push({
      startX: startX,
      startY: startY,
      endX: endX,
      endY: endY,
      direction: endX > startX ? 'right' : 'left'
    });
  }
});

readInterface.on("close", () => {
  const diagramInText = {};
  vents.forEach(vent => {
    switch (vent.direction) {
      case 'down':
        for (let i = vent.startY; i <= vent.endY; i += 1) {
          const position = `${vent.startX}_${i}`;
          if (!diagramInText[position]) {
            diagramInText[position] = 0
          }
          diagramInText[position] += 1;
        }
        break;
      case 'up':
        for (let i = vent.startY; i >= vent.endY; i -= 1) {
          const position = `${vent.startX}_${i}`;
          if (!diagramInText[position]) {
            diagramInText[position] = 0
          }
          diagramInText[position] += 1;
        }
        break;
      case 'right':
        for (let i = vent.startX; i <= vent.endX; i += 1) {
          const position = `${i}_${vent.startY}`;
          if (!diagramInText[position]) {
            diagramInText[position] = 0
          }
          diagramInText[position] += 1;
        }
        break;
      case 'left':
        for (let i = vent.startX; i >= vent.endX; i -= 1) {
          const position = `${i}_${vent.startY}`;
          if (!diagramInText[position]) {
            diagramInText[position] = 0
          }
          diagramInText[position] += 1;
        }
        break;
      default:
        break;
    }
  });

  
  const moreThanTwo = Object.values(diagramInText).filter(count => (count >= 2));
  console.log(moreThanTwo.length);
});

