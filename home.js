const saveBtn = document.getElementById("save-name");

saveBtn.addEventListener("click", function (event) {
    event.preventDefault();
    const name = document.getElementById("name-input").value;
    sessionStorage.setItem("spaceGameName", name);

    // Go to the next page
    window.location.href = window.location.href.replace("/index.html", "/play.html");
});