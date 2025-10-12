let diff = document.getElementById("diff");

diff.addEventListener("click", () => {
    let diffList = document.getElementById(".diff-list");
    diffList.classList.toggle("show");
    diff.classList.toggle("active");
    console.log("clicked");
});