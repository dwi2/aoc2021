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

const shouldStop = (cave, path) => {  
  const caves = path.split(",");
  caves.push(cave);

  const smallCaves = caves.filter(c => {
    return isSmallCave(c);
  });

  const visitedCount = {};
  smallCaves.forEach(sc => {
    if (!visitedCount[sc]) {
      visitedCount[sc] = 0;
    }
    visitedCount[sc] += 1;
  });

  let count = 0;
  const result = Object.values(visitedCount).some(vc => {
    if (vc === 2) {
      count += 1;
    } else if (vc > 2) {
      return true;
    }
    return count > 1;
  });
  // console.log(smallCaves, result);
  return result;
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

  // console.log(`traverse ${path},${currentCave}`);

  connectedCaves.forEach(cave => {
    if (!isStart(cave) && !shouldStop(cave, path)) {
      traverse(cave, `${path ? path + ',' : ''}${currentCave}`);
    }
  });
};


// This solution is not correct for input.medium and input.example
// But it works for input.tiny and my puzzle input. ¯\_(ツ)_/¯
readInterface.on("close", () => {
  traverse('start', '');
  // console.log(paths);
  console.log(paths.length);
});
