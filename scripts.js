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
})

medium.addEventListener("click", () => {
  diffbtn.textContent = "Medium";
})

hard.addEventListener("click", () => {
  diffbtn.textContent = "Hard";
})

let submit = document.getElementById("submit");
submit.addEventListener("click", () => {
    submit.classList("color")
    console.log("clicked");
});

let numSelected = null;
let tileSelected = null;


var board = [
  "--74916-5",
  "2---6-3-9",
  "----7-1--",
  "-586----4",
  "--3---9--",
  "--62-187-",
  "9-4-7---2",
  "67-83----",
  "81--45---"
];

var solution = [
  "387491625",
  "241568379",
  "569327418",
  "758619234",
  "123784596",
  "496253187",
  "934176852",
  "675832941",
  "812945763"
];

window.onload = function() {
  setGame();
}

function setGame() {
  //Digits
  for(let i =1; i<=9; i++){
  let number = document.createElement("div");
  number.id = i;
  number.innerText = i;
  number.classList.add("number");
  document.getElementById("digits").appendChild(number);
}
  //Board
  for(let r = 0; r<9; r++){
    for(let c = 0; c<9; c++){
      let tile = document.createElement("div");
      tile.id = r.toString + "-" + c.toString;
      tile.classList.add("tile");
      document.getElementById("suduko").append(tile);
    }
  }
}