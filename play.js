class FlyingObject {
    #top;
    #left;
    #size;
    #element;
    #speed;
    #score = 0;
    #hasHit = false;
    static #leftStart = window.innerWidth + 50;

    /**
     * Creates a new FlyingObject
     * @param {string} type The object's CSS class
     */
    constructor(type) {
        this.#setStartValues()
        this.#element = this.#createElement(type);
        document.body.append(this.#element);
    }

    /**
     * Creates the HTMLElement to display
     * @param {string} type The string class name
     * @returns {HTMLElement}
     */
    #createElement(type) {
        const obj = document.createElement("div");
        obj.classList.add("flying-object");
        obj.classList.add(type);
        obj.style.top = `${this.#top}px`;
        obj.style.left = `${this.#left}px`;
        obj.style.fontSize = `${this.#size}px`;
        return obj;
    }

    /**
     * Helper function to generate a random number between two values
     * @param {number} minNum 
     * @param {number} maxNum 
     * @returns {number}
     */
    #randomBetween(minNum, maxNum) {
        return Math.random() * (maxNum - minNum) + minNum;
    }


    /**
     * Sets the star position and speed
     */
    #setStartValues() {
        this.#top = this.#randomBetween(10, window.innerHeight - 50);
        this.#left = FlyingObject.#leftStart;
        this.#size = this.#randomBetween(20, 60); 
        this.#speed = this.#randomBetween(5, 20);
        this.#hasHit = false;
    }

    /**
     * Gets the HTML Element that this object represents
     * @returns {HTMLElement}
     */
    getElement() {
        return this.#element;
    }

    /**
     * The number of times this object has hit the player.
     * @returns {number}
     */
    getScore() {
        return this.#score;
    }

    /**
     * Whether or not this object has hit the player.
     * @returns {boolean}
     */
    hasHit() {
        return this.#hasHit;
    }

    /**
     * Move the flying object
     */
    move() {
        this.#left -= this.#speed
        this.getElement().style.left = `${this.#left}px`;
        this.getElement().style.top = `${this.#top}px`;
        // Check for a hit
        if (!this.#hasHit && this.hit(player)) {
            this.#hasHit = true;
            this.#score++;
            updateScores();
        }

        if (this.getElement().getBoundingClientRect().x < -50) {
            this.#setStartValues()
        }
    }


    /**
     * Checks if this element has collided with another
     * @param {HTMLElement} otherElement 
     * @returns {boolean}
     */
    hit(otherElement) {
        const thisBox = this.#element.getBoundingClientRect();
        const otherBox = otherElement.getBoundingClientRect();
        return thisBox.x <= otherBox.x + otherBox.width && thisBox.x + thisBox.width >= otherBox.x
            && thisBox.y <= otherBox.y + otherBox.height && thisBox.y + thisBox.height >= otherBox.y;
    }


    end() {
        this.getElement().style.transition = "opacity 3s";
        this.getElement().style.opacity = 0;
    }
}

class Meteor extends FlyingObject {
    constructor() {
        super("meteor");
        this.getElement().innerHTML = '<span class="fa-solid fa-meteor"></span>';
    }
}

class Satellite extends FlyingObject {
    constructor() {
        super("satellite");
        this.getElement().innerHTML = '<span class="fa-solid fa-satellite"></span>';
    }

    move() {
        super.move();
        if (this.hasHit()) {
            this.getElement().style.visibility = "hidden";
        } else {
            this.getElement().style.visibility = "visible";
        }
    }
}


/**
 * Create some meteors
 * @param {[]} meteors An array to put the objects in
 */
function generateMeteors(meteors) {
    const ENEMY_COUNT = 3;
    for (let i = 0; i < ENEMY_COUNT; i++) {
        meteors.push(new Meteor());
    }
}


/**
 * Create some satellites
 * @param {[]} satellites An array to put the objects in
 */
function generateSatellites(satellites) {
    const COUNT = 2;
    for (let i = 0; i < COUNT; i++) {
        satellites.push(new Satellite());
    }
}

/**
 * Manage the countdown timer
 */
function countdown() {
    if (timeRemaining > 0) {
        timeRemaining--;
        document.getElementById("countdown").innerText = `0:${timeRemaining >= 10 ? timeRemaining : "0" + timeRemaining}`;
        setTimeout(countdown, 1000);
    } else {
        document.getElementById("end").style.display = "flex";
    }
}


function updateScores() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
    const satelliteCount = satellites.reduce((subtotal, obj) => subtotal + obj.getScore(), 0);
    const meteorCount = meteors.reduce((subtotal, obj) => subtotal + obj.getScore(), 0);
    document.getElementById("satellite-count").innerText = satelliteCount;
    document.getElementById("meteor-count").innerText = meteorCount;
    document.getElementById("satellite-result").innerText = satelliteCount;
    document.getElementById("meteor-result").innerText = meteorCount;
    document.getElementById("mission-result").innerText = satelliteCount > meteorCount ? "Mission succeeded!" : "Mission failed :(";
}


/**
 * Update the meteor and satellite states - the game loop.
 */
function game() {
    if (timeRemaining > 0) {
        for (const satellite of satellites) {
            satellite.move();
        }
        for (const meteor of meteors) {
            meteor.move();
        }
        // To create an animation loop, call this method each "frame": https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame
        window.requestAnimationFrame(game);
    } else {
        for (const satellite of satellites) {
            satellite.end();
        }
        for (const meteor of meteors) {
            meteor.end();
        }
        saveScores();
    }
}


const player = document.getElementById("player");
let timeRemaining = 30;
const meteors = [];
const satellites = [];


document.body.addEventListener("keydown", event => {
    const MOVE_AMT = 20;
    const PLAYER_HEIGHT = 40;
    switch (event.key) {
        case "ArrowUp":
        case "w":
            player.style.top = `${Math.max(player.offsetTop - MOVE_AMT, 0)}px`;
            break;
        case "ArrowDown":
        case "s":
            player.style.top = `${Math.min(player.offsetTop + MOVE_AMT, window.innerHeight - PLAYER_HEIGHT)}px`;
            break;
        default:
            break;
    }
});

document.getElementById("go").addEventListener("click", function () {
    // Draw the meteors and satellites and hide the instructions
    generateMeteors(meteors);
    generateSatellites(satellites);
    document.getElementById("instructions").style.display = "none";

    // start the timer
    setTimeout(countdown, 1000);
    game();
});

document.getElementById("to-log").addEventListener("click", function () {
    // Go to the next page
    window.location.href = window.location.href.replace("/play.html", "/log.html");
})


/**
 * Stores the scores at the end of the game
 */
function saveScores() {
    let currentScores = [];
    let player = sessionStorage.getItem("spaceGameName");
    if (localStorage.getItem("spaceGameStorage") !== null) {
        currentScores = localStorage.getItem("spaceGameStorage");
    }
    currentScores.push({
        player: player,
        satellites: document.getElementById("satellite-result").innerText,
        meteors: document.getElementById("meteor-result").innerText
    })
    localStorage.setItem("spaceGameStorage", currentScores);
}