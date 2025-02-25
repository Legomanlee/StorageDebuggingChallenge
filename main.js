/**
 * Generate random stars for the background
 */
function generateStars() {
    const COUNT = 50;
    const MIN_SIZE = 2;
    const MAX_SIZE = 8;
    const containers = document.getElementsByClassName("stars");
    for (const container of containers) {
        for (let i = 0; i < COUNT; i++) {
            const star = document.createElement("div");
            star.setAttribute("class", "star");
            // Generate some random property values
            const size = Math.random() * (MAX_SIZE - MIN_SIZE) + MIN_SIZE;
            const top = Math.random() * 100;
            const left = Math.random() * 100;
            const delay = Math.random() * 5;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.top = `${top}vh`;
            star.style.left = `${left}vw`;
            star.style.animationDelay = `${delay}s`;
    
            container.append(star);
        }
    }
}

generateStars();