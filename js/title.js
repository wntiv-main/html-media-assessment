function randint(/* inclusive */min, /* exclusive */max){
    return min + Math.floor(Math.random() * (max - min));
}

function toTitleCase(str) {
    var result = "", isNewWord = true;
    for (var char of str) {
        if (isNewWord && char != char.toUpperCase()) {
            char = char.toUpperCase();
            isNewWord = false;
        }
        result += char;
        if (char == ' ') {
            isNewWord = true;
        }
    }
    return result;
}

// The games. The URL for the page must be <game>.html and each
// Image must be <game>_<n>.jpg, where n is in the range 1..noImages[game]
// and game is an element in the games array.
var games = ["league-of-legends", "minėcraft", "rocket-league"];
var navPages = [].concat("index", games);
var noImgs = { "league-of-legends": 4, "minėcraft": 7, "rocket-league": 2 };

function getBackgroundImage(){
    // On main pages, use random game image
    var game = games[randint(0, games.length)];
    // On game-specific pages, use that game's images
    for(var g of games){
        if(decodeURIComponent(location.pathname).includes(g)){
            game = g;
        }
    }
    // Format correctly and use correct file path and extension
    return `img/${game}_${randint(1, noImgs[game] + 1)}.jpg`;
}

// Useful background elements
var background = {
    main: document.querySelector(".title .background.main"),
    fade: document.querySelector(".title .background.fade"),
    header: document.querySelector(".title header")
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

function doFollowMouse(goto) {
    var el = document.querySelector(".title .mousefollower");
    el.style.left = `${goto.x}px`;
    el.style.top = `${goto.y}px`;
}

var lastScrollPos = { x: 0, y: 0 };
function onScroll(e) {
    var target = e.target;
    // Find the scrolling element
    while (typeof target.scrollTop == 'undefined') { target = target.lastElementChild; }
    // Update mouse follower so it doesnt get stuck when scrolling
    var el = document.querySelector(".title .mousefollower");
    var pos = { x: parseFloat(el.style.left), y: parseFloat(el.style.top) }
    pos.x += target.scrollLeft - lastScrollPos.x;
    pos.y += target.scrollTop - lastScrollPos.y;
    doFollowMouse(pos);
    lastScrollPos.x = target.scrollLeft;
    lastScrollPos.y = target.scrollTop;
    // Update parallax
    background.main.style.backgroundPositionY = `${-target.scrollTop / 3}px`;
    background.fade.style.backgroundPositionY = `${-target.scrollTop / 3}px`;
    background.header.style.top = `calc(50% - ${target.scrollTop * 2 / 3}px)`;
}

function onMouseMove(e) {
    var el = document.querySelector(".title .mousefollower");
    // Update mouse follower
    doFollowMouse({
        x: e.pageX - el.getBoundingClientRect().width / 2,
        y: e.pageY - el.getBoundingClientRect().height / 2
    });
}

// Set up listeners
document.addEventListener("scroll", onScroll);
document.addEventListener("mousemove", onMouseMove);

// Set up navbar
var navbar = document.querySelector("nav ul");
for (var page of navPages) {
    var liEl = document.createElement("li");
    var aEl = document.createElement("a");
    aEl.innerText = toTitleCase(page.replace(/-/g, " ").replace("index", "home").replace("ė", "e"));
    aEl.href = `./${page}.html`
    if (decodeURIComponent(location.pathname).includes(page)) {
        aEl.className = "selected";
        // Disable button from navigating
        aEl.addEventListener("click", (e) => e.preventDefault());
        // Mark as disabled for screen-readers
        aEl.setAttribute("aria-disabled", true);
    }
    liEl.appendChild(aEl);
    navbar.appendChild(liEl);
}