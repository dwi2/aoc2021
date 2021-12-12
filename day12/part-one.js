const readline = require("readline");
const fs = require("fs");

const readInterface = readline.createInterface({
  input: fs.createReadStream("./input"),
  // output: process.stdout,
  console: false,
});

const map = {};

const createEntryIfNeeded = (cave) => {
  if (!map[cave]) {
    map[cave] = [];
  }
};

const connect = (caveA, caveB) => {
  createEntryIfNeeded(caveA);
  createEntryIfNeeded(caveB);
  // perhaps we don't need the check
  if (!map[caveA].includes(caveB)) {
    map[caveA].push(caveB);
  }
  if (!map[caveB].includes(caveA)) {
    map[caveB].push(caveA);
  }
}

const isSmallCave = (cave) => {
  return cave.toLowerCase() === cave && !isStart(cave) && !isEnd(cave);
};

const isStart = (cave) => {
  return cave === 'start';
};

const isEnd = (cave) => {
  return cave == 'end';
};

const hasVisitedTheSmallCaveAlready = (cave, path) => {
  const visitedCaves = path.split(",");
  return visitedCaves.some(c => {
    return isSmallCave(c) && c === cave;
  });
};

readInterface.on("line", (connection) => {
  const [caveA, caveB] = connection.split("-");
  connect(caveA, caveB);
});

const paths = [];
const traverse = (currentCave, path) => {
  const connectedCaves = map[currentCave];
  if (isEnd(currentCave)) {
    paths.push(`${path},${currentCave}`);
    return;
  }

  connectedCaves.forEach(cave => {
    if (!hasVisitedTheSmallCaveAlready(cave, path) &&
      !isStart(cave)) {
      traverse(cave, `${path},${currentCave}`);
    }
  });
};

readInterface.on("close", () => {
  traverse('start', '');
  console.log(paths.length);
});
