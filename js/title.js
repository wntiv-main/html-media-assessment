function randint(/* inclusive */min, /* exclusive */max){
    return min + Math.floor(Math.random() * (max - min));
}

var games = ["league-of-legends", "minėcraft", "rocket-league"];
function getBackgroundImage(){
    var noImgs = {"league-of-legends": 4, "minėcraft": 7, "rocket-league": 2};
    // On main pages, use random game image
    var game = games[randint(0, games.length)];
    // On game-specific pages, use that game's images
    for(var g of games){
        if(decodeURIComponent(location.pathname).indexOf(g) >= 0){
            game = g;
        }
    }
    // Format correctly and use correct file path and extension
    return `img/${game}_${randint(1, noImgs[game] + 1)}.jpg`;
}

var background = {
    main: document.querySelector(".title .background.main"),
    fade: document.querySelector(".title .background.fade")
}

// Set initial background (hopefully quick enough that user does not notice)
background.main.style.backgroundImage = `url("${getBackgroundImage()}")`;

// Change background every 10sec
// NOTE: selection is random so may change to be the same as before
setInterval(() => {
    var image = getBackgroundImage();
    // If is the same, don't select again, just wait another 10 seconds
    // Return early to reduce resource usage
    if(`url("${image}")` == background.main.style.backgroundImage) return;
    var imgEl = new Image();
    // Wait for the image to be loaded in memory
    imgEl.addEventListener("load", () => {
        // Then apply image to the background and fade it in
        background.fade.style.backgroundImage = `url("${image}")`;
        background.fade.style.opacity = 1;
        setTimeout(() => {
            // Once fully faded, reset for next fade
            background.main.style.backgroundImage = `url("${image}")`;
            background.fade.style.opacity = 0;
        }, 1e3);
    });
    imgEl.src = image;
}, 10e3);

document.addEventListener("scroll", (e)=>{
    background.main.style.backgroundPositionY = `${-e.target.scrollTop / 2}px`;
    background.fade.style.backgroundPositionY = `${-e.target.scrollTop / 2}px`;
});