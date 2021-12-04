const readline = require("readline");
const fs = require("fs");

const readInterface = readline.createInterface({
  input: fs.createReadStream("./input"),
  // output: process.stdout,
  console: false,
});

const draw = [];
const boards = [];
const drawedBoards = [];
let lineCount = 0;
let board = [];
let row = 0;
readInterface.on("line", (line) => {
  if (lineCount === 0) {
    line.split(',').forEach(n => {
      draw.push(n);
    });
  } else {
    if (line.length > 0) {
      let column = 0;
      line.split(' ').forEach((numberInBoard) => {
        const num = Number.parseInt(numberInBoard);
        if (!Number.isNaN(num)) {
          board[num] = [column, row];
          column += 1;
        }
      });
      row += 1;
    } else {
      if (board.length > 0) {
        boards.push(board);
      }
      board = [];
      row = 0;
    }
  }
  lineCount += 1;
});

readInterface.on("close", () => {
  if (board.length > 0) {
    boards.push(board);
    board = [];
    row = 0;
  }

  boards.forEach(() => {
    drawedBoards.push([]);
  });

  try {
    draw.forEach(luckyNumber => {
      boards.forEach((board, index) => {
        const pair = board[luckyNumber];
        if (pair) {
          drawedBoards[index].push(pair);
        }
        board[luckyNumber] = undefined;
      });

      // check bingo
      drawedBoards.forEach((db, theBoard) => {
        let x = [0, 0, 0, 0, 0];
        let y = [0, 0, 0, 0, 0];
        db.forEach(pair => {
          if (pair && pair.length === 2) {
            x[pair[0]] += 1;
            y[pair[1]] += 1;
          }

          if (x[pair[0]] >= 5 || y[pair[1]] >= 5) {
            console.log('bingo');
            throw Error(`${theBoard},${luckyNumber}`);
          }
        });
      });
    });
  } catch (e) {
    
    const [theBoard, luckyNumber] = e.message.split(',');
    console.log(theBoard, luckyNumber);

    let sumOfUnmarked = 0;
    boards[theBoard].forEach((n, index) => {
      if (n) {
        sumOfUnmarked += index;
      }
    });
    console.log(sumOfUnmarked);
    console.log(sumOfUnmarked * luckyNumber);
  }
});

