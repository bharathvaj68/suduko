let diff = document.getElementById("diff-button");

diff.addEventListener("click", () => {
    let diffList = document.querySelector(".diff-list");
    diffList.classList.toggle("show");
    diff.classList.toggle("active");
    console.log("clicked");
});