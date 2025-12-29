/* FIREBASE INITIALIZATION  */
const firebaseConfig = {
  apiKey: "AIzaSyCBv1_5DH0TZu1j5yEUXqltCHn8CZTgfr4",
  authDomain: "suduko-c700e.firebaseapp.com",
  projectId: "suduko-c700e",
  storageBucket: "suduko-c700e.firebasestorage.app",
  messagingSenderId: "1080684596302",
  appId: "1:1080684596302:web:89a666975a04fdec20471f",
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

overlay.addEventListener("click", () => {
  overlay.classList.remove("show");
  scoreboard.classList.remove("show");
});

/* AUTH UI */
const userIcon = document.getElementById("user");
const overlay2 = document.getElementById("overlay2");
const authContainer = document.getElementById("authcontainer");
const closeButton2 = document.getElementById("close2");
const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");

/* AUTH LOGIC */
userIcon.addEventListener("click", () => {
  if (auth.currentUser) {
    auth.signOut();
  } else {
    overlay2.classList.add("show");
    authContainer.classList.add("show");
  }
});

closeButton2.addEventListener("click", () => {
  overlay2.classList.remove("show");
  authContainer.classList.remove("show");
});

signupBtn.addEventListener("click", () => {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!name || !email || !password) return alert("Fill all fields");

  auth.createUserWithEmailAndPassword(email, password)
    .then((cred) => {
      const user = cred.user;

      return user.updateProfile({ displayName: name }).then(() => {
        return db.collection("users").doc(user.uid).set({
          name,
          email,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
      });
    })
    .then(() => {
      overlay2.classList.remove("show");
      authContainer.classList.remove("show");
    })
    .catch((err) => alert(err.message));
});

loginBtn.addEventListener("click", () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      overlay2.classList.remove("show");
      authContainer.classList.remove("show");
      loadLeaderboard();
    })
    .catch((err) => alert(err.message));
});

auth.onAuthStateChanged((user) => {
  userIcon.src = user ? "image/logout.svg" : "image/user.svg";
});

/* DIFFICULTY */
const diffbtn = document.getElementById("diff-btn");
const difflist = document.getElementById("diff-list");
["easy", "medium", "hard"].forEach((id, idx) => {
  document.getElementById(id).addEventListener("click", () => {
    diff = idx;
    diffbtn.textContent = id.toUpperCase();
    difflist.classList.remove("diff-list-show");
    resetBoard();
    setDiff(diff);
    setGame();
  });
});

/* PUZZLES */
function setDiff(d = 0) {
  const puzzles = [
    {
      board: [
        "--74916-5","2---6-3-9","-----7-1-",
        "-586----4","--3----9-","--62--187",
        "9-4-7---2","67-83----","81--45---"
      ],
      solution: [
        "387491625","241568379","569327418",
        "758619234","123784596","496253187",
        "934176852","675832941","812945763"
      ]
    },
    {
      board: [
        "5-3--7---","6--195---","-98----6-",
        "8---6---3","4--8-3--1","7---2---6",
        "-6----28-","---419--5","---8--79-"
      ],
      solution: [
        "543627891","672195348","198384562",
        "859761423","426853971","713942856",
        "961537284","287419635","354286719"
      ]
    },
    {
      board: [
        "1--9-----","--3---2--","-7--1--6-",
        "----7----","--5---3--","----2----",
        "-4--6--9-","--9---5--","-----8--7"
      ],
      solution: [
        "162943578","853761249","479512361",
        "236874195","915689432","748235916",
        "547326189","629197854","381458627"
      ]
    }
  ];

  board = puzzles[d].board;
  solution = puzzles[d].solution;
  boardArray = board.map(r => r.split(""));
  userBoardArray = board.map(r => r.split(""));
  solutionArray = solution.map(r => r.split(""));
}

/* GAME SETUP */
function setGame() {
  const digits = document.getElementById("digits");
  const grid = document.getElementById("suduko");
  digits.innerHTML = "";
  grid.innerHTML = "";
  emptyCells = 0;

  for (let i = 1; i <= 9; i++) {
    const n = document.createElement("div");
    n.textContent = i;
    n.className = "number";
    n.onclick = () => numSelected = n;
    digits.appendChild(n);
  }

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const tile = document.createElement("div");
      tile.id = `${r}-${c}`;
      tile.className = "tile";

      if (board[r][c] !== "-") {
        tile.textContent = board[r][c];
      } else {
        emptyCells++;
        tile.classList.add("input");
        tile.onclick = () => {
          if (numSelected) {
            tile.textContent = numSelected.textContent;
            userBoardArray[r][c] = numSelected.textContent;
          }
        };
      }

      grid.appendChild(tile);
    }
  }
}

function resetBoard() {
  document.getElementById("suduko").innerHTML = "";
  document.getElementById("digits").innerHTML = "";
}

/* SCORE LOGIC */
function checkColor() {
  let correct = 0;
  let empty = 0;

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (boardArray[r][c] === "-") {
        if (userBoardArray[r][c] === "-") empty++;
        else if (userBoardArray[r][c] === solutionArray[r][c]) correct++;
      }
    }
  }

  if (empty > 0) return alert("Fill all cells");

  const score = Math.floor((correct / emptyCells) * 100);
  alert(`Your Score: ${score}`);

  if (auth.currentUser) saveScore(score);

  setTimeout(() => {
    resetBoard();
    setDiff(diff);
    setGame();
  }, 800);
}

document.getElementById("submit").onclick = checkColor;

/* SAVE & LOAD SCORES */
function saveScore(score) {
  const user = auth.currentUser;
  if (!user) return;

  db.collection("scores").doc(user.uid).set({
    name: user.displayName,
    score: firebase.firestore.FieldValue.increment(score),
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  }, { merge: true }).then(loadLeaderboard);
}

function loadLeaderboard() {
  const scoresDiv = document.querySelector(".scores");
  if (!scoresDiv) return;

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
        row.classList.add("d-flex", "justify-content-between", "leaderboard-row");

        row.innerHTML = `
          <div>${rank}. ${data.name || "Unknown"}</div>
          <div>${data.score || 0}</div>
        `;

        scoresDiv.appendChild(row);
        rank++;
      });
    })
    .catch((err) => {
      console.error("❌ Leaderboard load error:", err);
    });
}

/* INITIAL LOAD */
window.onload = () => {
  setDiff(0);
  setGame();
};
