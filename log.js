const savedScores = JSON.parse(localStorage.getItem("spaceGameStorage"));

const table = document.getElementById("scores");
for (const score of savedScores) {
    const newRow = document.createElement("tr");

    const nameCol = document.createElement("td");
    nameCol.innerText = score.player;
    newRow.appendChild(nameCol);

    const satCol = document.createElement("td");
    satCol.innerText = score.satellites;
    newRow.appendChild(satCol);

    const metCol = document.createElement("td");
    metCol.innerText = score.meteors;
    newRow.appendChild(metCol);

    const outcome = document.createElement("td");
    if (Number.parseInt(score.satellites) > Number.parseInt(score.meteors)) {
        outcome.innerHTML = '<span class="fa-solid fa-medal"></span>';
    } else {
        outcome.innerHTML = '<span class="fa-solid fa-skull-crossbones"></span>';
    }
    newRow.appendChild(outcome);

    table.appendChild(newRow);
}