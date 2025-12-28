// Initializes Global Values
let board = [];
let solution = [];

let boardArray = [];
let userBoardArray = [];
let solutionArray = [];

let diff = 0;

let numSelected = null;
let tileSelected = null;

let emptyCells = 0;

//Leaderboard Logic
let leaderboard = document.getElementById("leaderboard");
let overlay = document.getElementById("overlay");
let scoreboard = document.getElementById("scoreboard");
let closeButton = document.getElementById("close");

leaderboard.addEventListener("click", ()=> {
  overlay.classList.add("overlay-show");
  scoreboard.classList.add("scoreboard-show");
  console.log("clicked");
});

closeButton.addEventListener("click", () => {
  overlay.classList.remove("overlay-show");
  scoreboard.classList.remove("scoreboard-show");
  overlay.classList.add("overlay");
  scoreboard.classList.add("scoreboard");
});

overlay.addEventListener("click", () => {
  overlay.classList.remove("overlay-show");
  scoreboard.classList.remove("scoreboard-show");
  overlay.classList.add("overlay");
  scoreboard.classList.add("scoreboard");
})


// Difficulty Buttons Logic
let diffbtn = document.getElementById("diff-btn");
let difflist = document.getElementById("diff-list");

diffbtn.addEventListener("click", () => {
  difflist.classList.toggle("diff-list-show");
});

let easy = document.getElementById("easy");
let medium = document.getElementById("medium");
let hard = document.getElementById("hard");

easy.addEventListener("click", () => {
  diffbtn.textContent = "Easy";
  diff = 0;
  difflist.classList.add("diff-list-hide");
  difflist.classList.remove("diff-list-show");
  setDiff(diff);
  resetBoard();
  setGame();
});

medium.addEventListener("click", () => {
  diffbtn.textContent = "Medium";
  diff = 1;
  difflist.classList.add("diff-list-hide");
  difflist.classList.remove("diff-list-show");
  setDiff(diff);
  resetBoard();
  setGame();
});

hard.addEventListener("click", () => {
  diffbtn.textContent = "Hard";
  diff = 2;
  difflist.classList.add("diff-list-hide");
  difflist.classList.remove("diff-list-show");
  setDiff(diff);
  resetBoard();
  setGame();
});

// Sets Difficulty

function setDiff(diff = 0) {
  if (diff === 0) {
    board = [
      "--74916-5",
      "2---6-3-9",
      "-----7-1-",
      "-586----4",
      "--3----9-",
      "--62--187",
      "9-4-7---2",
      "67-83----",
      "81--45---",
    ];

    solution = [
      "387491625",
      "241568379",
      "569327418",
      "758619234",
      "123784596",
      "496253187",
      "934176852",
      "675832941",
      "812945763",
    ];
  } else if (diff === 1) {
    board = [
      "5-3--7---",
      "6--195---",
      "-98----6-",
      "8---6---3",
      "4--8-3--1",
      "7---2---6",
      "-6----28-",
      "---419--5",
      "---8--79-",
    ];

    solution = [
      "543627891",
      "672195348",
      "198384562",
      "859761423",
      "426853971",
      "713942856",
      "961537284",
      "287419635",
      "354286719",
    ];
  } else if (diff === 2) {
    board = [
      "1--9-----",
      "--3---2--",
      "-7--1--6-",
      "----7----",
      "--5---3--",
      "----2----",
      "-4--6--9-",
      "--9---5--",
      "-----8--7",
    ];

    solution = [
      "162943578",
      "853761249",
      "479512361",
      "236874195",
      "915689432",
      "748235916",
      "547326189",
      "629197854",
      "381458627",
    ];
  }

  boardArray = board.map((r) => r.split(""));
  userBoardArray = board.map((r) => r.split(""));
  solutionArray = solution.map((r) => r.split(""));
}

// Game Set
function setGame() {
  // Creates digits buttons
  for (let i = 1; i <= 9; i++) {
    let number = document.createElement("div");
    number.id = i;
    number.innerText = i;
    number.addEventListener("click", selectNumber);
    number.classList.add("number");
    document.getElementById("digits").appendChild(number);
  }

  // Create Sudoku grid
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      let tile = document.createElement("div");
      tile.id = r + "-" + c;

      if (board[r][c] !== "-") {
        tile.innerText = board[r][c];
      } else {
        tile.classList.add("input");
        emptyCells++;
      }

      if (r == 2 || r == 5) tile.classList.add("down-border");
      if (c == 2 || c == 5) tile.classList.add("right-border");

      tile.addEventListener("click", selectTile);
      tile.classList.add("tile");
      document.getElementById("suduko").append(tile);
    }
  }
}

// Resets Board

function resetBoard() {
  document.getElementById("suduko").innerHTML = "";
  document.getElementById("digits").innerHTML = "";
  emptyCells = 0;
}

// Selection & Checking Logic

function selectNumber() {
  if (numSelected) numSelected.classList.remove("number-selected");
  numSelected = this;
  numSelected.classList.add("number-selected");
}

function selectTile() {
  if (!numSelected) return;
  let [r, c] = this.id.split("-").map(Number);
  if (boardArray[r][c] === "-") {
    this.innerText = numSelected.id;
    userBoardArray[r][c] = numSelected.id;
  }
}

function checkColor() {
  let unusedCells = 0;
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (boardArray[r][c] === "-") {
        let tile = document.getElementById(r + "-" + c);
        tile.classList.remove("correct", "wrong");
        if (userBoardArray[r][c] === "-") {
          unusedCells++;
          continue;
        }
        if (userBoardArray[r][c] === solutionArray[r][c]) {
          tile.classList.add("correct");
        } else {
          tile.classList.add("wrong");
        }
      }
    }
  }

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (boardArray[r][c] === "-") {
        let tile = document.getElementById(r + "-" + c);
        tile.classList.remove("correct", "wrong");
        if (unusedCells === 0) {
          if (userBoardArray[r][c] === solutionArray[r][c]) {
            tile.classList.add("correct");
          } else {
            tile.classList.add("wrong");
          }
        }
      }
    }
  }
  console.log(unusedCells);
}

let submit = document.getElementById("submit");
submit.addEventListener("click", checkColor);

// Initial Game Start

window.onload = function () {
  setDiff(0);
  setGame(); // Builds game
};
