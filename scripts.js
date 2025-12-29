/* FIREBASE INITIALIZATION */
const firebaseConfig = {
  apiKey: "AIzaSyCBv1_5DH0TZu1j5yEUXqltCHn8CZTgfr4",
  authDomain: "suduko-c700e.firebaseapp.com",
  projectId: "suduko-c700e",
  storageBucket: "suduko-c700e.firebasestorage.app",
  messagingSenderId: "1080684596302",
  appId: "1:1080684596302:web:89a666975a04fdec20471f",
  measurementId: "G-50N9V1T2LW",
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

/* GLOBAL VARIABLES */
let board = [];
let solution = [];
let boardArray = [];
let userBoardArray = [];
let solutionArray = [];
let diff = 0;
let numSelected = null;
let tileSelected = null;
let emptyCells = 0;

/* LEADERBOARD OVERLAY LOGIC */
const leaderboardIcon = document.getElementById("leaderboard");
const overlay = document.getElementById("overlay");
const scoreboard = document.getElementById("scoreboard");
const closeButton = document.getElementById("close");

leaderboardIcon.addEventListener("click", () => {
  overlay.classList.add("show");
  scoreboard.classList.add("show");
  loadLeaderboard();
});

closeButton.addEventListener("click", () => {
  overlay.classList.remove("show");
  scoreboard.classList.remove("show");
});

/* AUTHENTICATION LOGIC */
const userIcon = document.getElementById("user");
const overlay2 = document.getElementById("overlay2");
const authContainer = document.getElementById("authcontainer");
const closeButton2 = document.getElementById("close2");
const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");

userIcon.addEventListener("click", () => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    // Logout
    auth.signOut()
      .then(() => {
        console.log("User logged out");
        userIcon.src = "image/user.svg";
      })
      .catch((err) => console.error("Logout error:", err));
  } else {
    // Show login/signup window
    overlay2.classList.add("show");
    authContainer.classList.add("show");
  }
});

closeButton2.addEventListener("click", () => {
  overlay2.classList.remove("show");
  authContainer.classList.remove("show");
});

// SIGNUP (with name)
signupBtn.addEventListener("click", () => {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!name || !email || !password) {
    alert("Please fill out all fields.");
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      db.collection("users").doc(user.uid).set({
        name: name,
        email: email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        console.log("User info saved successfully!");
      })
      .catch((error) => console.error("Error saving user info:", error));

      overlay2.classList.remove("show");
      authContainer.classList.remove("show");
      userIcon.src = "image/logout.svg";
    })
    .catch((error) => alert(error.message));
});


// LOGIN
loginBtn.addEventListener("click", () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please enter both email and password!");
    return;
  }

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      const userDoc = db.collection("users").doc(user.uid);
      userDoc.get().then((doc) => {
        if (!doc.exists) {
          
          userDoc.set({
            name: user.name,
            email: user.email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          })
          .then(() => console.log("Auto-created user profile for existing user"));
        }
      });

      userIcon.src = "image/logout.svg";
      overlay2.classList.remove("show");
      authContainer.classList.remove("show");
      loadLeaderboard();
    })
    .catch((error) => {
      console.error("Login error:", error);
      alert(error.message);
    });
});


// AUTO ICON UPDATE
auth.onAuthStateChanged((user) => {
  userIcon.src = user ? "image/logout.svg" : "image/user.svg";
});

/* PASSWORD TOGGLE LOGIC */
const passwordInput = document.getElementById("password");
const toggleEye = document.getElementById("toggle-eye");

toggleEye.addEventListener("click", () => {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggleEye.src = "image/eye-open.svg";
  } else {
    passwordInput.type = "password";
    toggleEye.src = "image/eye-close.svg";
  }
});


/* DIFFICULTY BUTTON LOGIC */
const diffbtn = document.getElementById("diff-btn");
const difflist = document.getElementById("diff-list");
const easy = document.getElementById("easy");
const medium = document.getElementById("medium");
const hard = document.getElementById("hard");

diffbtn.addEventListener("click", () => {
  difflist.classList.toggle("diff-list-show");
});

[easy, medium, hard].forEach((btn, idx) => {
  btn.addEventListener("click", () => {
    diff = idx;
    diffbtn.textContent = btn.textContent;
    difflist.classList.remove("diff-list-show");
    resetBoard();
    setDiff(diff);
    setGame();
  });
});

/* SET GAME DIFFICULTY */

// Rotate a 9x9 matrix 90° clockwise N times
function rotateMatrix(matrix, times = 1) {
  for (let t = 0; t < times; t++) {
    matrix = matrix[0].split('').map((_, colIndex) =>
      matrix.map(row => row[colIndex]).reverse().join('')
    );
  }
  return matrix;
}

// Flip a 9x9 matrix horizontally or vertically
function flipMatrix(matrix, direction = "horizontal") {
  if (direction === "horizontal") {
    return matrix.map(row => row.split('').reverse().join(''));
  } else if (direction === "vertical") {
    return [...matrix].reverse();
  }
  return matrix;
}

// Set board and solution with random transformations
function setDiff(diff = 0) {
  const puzzles = [
    {
      board: [
        "--74916-5",
        "2---6-3-9",
        "-----7-1-",
        "-586----4",
        "--3----9-",
        "--62--187",
        "9-4-7---2",
        "67-83----",
        "81--45---",
      ],
      solution: [
        "387491625",
        "241568379",
        "569327418",
        "758619234",
        "123784596",
        "496253187",
        "934176852",
        "675832941",
        "812945763",
      ],
    },
    {
      board: [
        "5-3--7---",
        "6--195---",
        "-98----6-",
        "8---6---3",
        "4--8-3--1",
        "7---2---6",
        "-6----28-",
        "---419--5",
        "---8--79-",
      ],
      solution: [
        "543627891",
        "672195348",
        "198384562",
        "859761423",
        "426853971",
        "713942856",
        "961537284",
        "287419635",
        "354286719",
      ],
    },
    {
      board: [
        "1--9-----",
        "--3---2--",
        "-7--1--6-",
        "----7----",
        "--5---3--",
        "----2----",
        "-4--6--9-",
        "--9---5--",
        "-----8--7",
      ],
      solution: [
        "162943578",
        "853761249",
        "479512361",
        "236874195",
        "915689432",
        "748235916",
        "547326189",
        "629197854",
        "381458627",
      ],
    },
  ];

  // Select base puzzle by difficulty
  const selected = puzzles[diff];

  // Rotation
  const rotations = Math.floor(Math.random() * 4);
  let randomizedBoard = rotateMatrix(selected.board, rotations);
  let randomizedSolution = rotateMatrix(selected.solution, rotations);

  // Flip Horizontally and Vertically
  if (Math.random() < 0.5) {
    randomizedBoard = flipMatrix(randomizedBoard, "horizontal");
    randomizedSolution = flipMatrix(randomizedSolution, "horizontal");
  }

  if (Math.random() < 0.5) {
    randomizedBoard = flipMatrix(randomizedBoard, "vertical");
    randomizedSolution = flipMatrix(randomizedSolution, "vertical");
  }

  // Apply final randomized setup
  board = randomizedBoard;
  solution = randomizedSolution;
  boardArray = board.map(r => r.split(""));
  userBoardArray = board.map(r => r.split(""));
  solutionArray = solution.map(r => r.split(""));

}


/* GAME SETUP AND LOGIC */
function setGame() {
  const digits = document.getElementById("digits");
  const sudokuGrid = document.getElementById("suduko");
  digits.innerHTML = "";
  sudokuGrid.innerHTML = "";
  emptyCells = 0;

  for (let i = 1; i <= 9; i++) {
    const number = document.createElement("div");
    number.id = i;
    number.innerText = i;
    number.classList.add("number");
    number.addEventListener("click", selectNumber);
    digits.appendChild(number);
  }

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const tile = document.createElement("div");
      tile.id = `${r}-${c}`;
      if (board[r][c] !== "-") {
        tile.innerText = board[r][c];
      } else {
        tile.classList.add("input");
        emptyCells++;
      }
      if (r === 2 || r === 5) tile.classList.add("down-border");
      if (c === 2 || c === 5) tile.classList.add("right-border");
      tile.classList.add("tile");
      tile.addEventListener("click", selectTile);
      sudokuGrid.appendChild(tile);
    }
  }
}

function resetBoard() {
  document.getElementById("suduko").innerHTML = "";
  document.getElementById("digits").innerHTML = "";
  emptyCells = 0;
}

function selectNumber() {
  if (numSelected) numSelected.classList.remove("number-selected");
  numSelected = this;
  numSelected.classList.add("number-selected");
}

function selectTile() {
  if (!numSelected) return;
  const [r, c] = this.id.split("-").map(Number);
  if (boardArray[r][c] === "-") {
    this.innerText = numSelected.id;
    userBoardArray[r][c] = numSelected.id;
  }
}

/* SCORE CALCULATION LOGIC */
function checkColor() {
  let unusedCells = 0;
  let correctCount = 0;

  // Step 1: Count and mark each tile
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (boardArray[r][c] === "-") {
        const tile = document.getElementById(`${r}-${c}`);
        tile.classList.remove("correct", "wrong");

        if (userBoardArray[r][c] === "-") {
          unusedCells++;
        } else if (userBoardArray[r][c] === solutionArray[r][c]) {
          tile.classList.add("correct");
          correctCount++;
        } else {
          tile.classList.add("wrong");
        }
      }
    }
  }

  // Step 2: Block submit if board not fully filled
  if (unusedCells > 0) {
    console.log(`You still have ${unusedCells} empty cells. Cannot submit yet.`);
    alert (`You still have ${unusedCells} empty cells. Cannot submit yet.`);
    return; // Stop here
  }

  // Step 3: If board is completely filled, calculate score
  const score = Math.floor((correctCount / emptyCells) * 100);

  // Step 4: Alert and save score only if all filled
  if (correctCount === emptyCells) {
    alert("You have completed the Sudoku perfectly!");
  }

  // Step 5: Save only if logged in
  if (auth.currentUser) {
    saveScore(score);
  } else {
    console.log(" Score not saved — user not logged in.");
  }

  // Step 6: Reset board after short delay
  setTimeout(() => {
    resetBoard();
    setDiff(diff);
    setGame();
  }, 1000);
}

document.getElementById("submit").addEventListener("click", checkColor);

/* SAVE AND LOAD SCORES */
function saveScore(score) {
  const user = auth.currentUser;
  if (!user) {
    alert("Skipping score save — no user logged in.");
    return;
  }

  const userInfoDoc = db.collection("users").doc(user.uid);
  const scoreDoc = db.collection("scores").doc(user.uid);

  userInfoDoc.get().then((info) => {
    const name = info.exists ? info.data().name : "Unknown";

    scoreDoc.get().then((doc) => {
      const oldScore = doc.exists ? doc.data().score || 0 : 0;
      const newTotal = oldScore + score;

      scoreDoc
        .set({
          name: name,
          score: newTotal,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          console.log(`Score updated for ${name}: +${score} (total: ${newTotal})`);
          loadLeaderboard();
        });
    });
  });
}


function loadLeaderboard() {
  const scoresDiv = document.querySelector(".scores");
  scoresDiv.innerHTML = "";

  db.collection("scores")   
    .orderBy("score", "desc")
    .limit(10)
    .get()
    .then((snapshot) => {
      let rank = 1;
      snapshot.forEach((doc) => {
        const data = doc.data();
        const row = document.createElement("div");
        row.classList.add("d-flex", "justify-content-between");
        row.innerHTML = `<div>${rank}. ${data.name || "Unknown"}</div><div>${data.score}</div>`;
        scoresDiv.appendChild(row);
        rank++;
      });
    });
}

/* INITIAL LOAD */
window.onload = function () {
  setDiff(0);
  setGame();
};
