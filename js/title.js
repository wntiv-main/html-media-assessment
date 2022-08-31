function randint( /* inclusive */ min, /* exclusive */ max) {
	return min + Math.floor(Math.random() * (max - min));
}

function toTitleCase(str) {
	var result = "",
		isNewWord = true;
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
var navPages = [].concat("index", games, "coming-soon");
var noImgs = {
	"league-of-legends": 4,
	"minėcraft": 7,
	"rocket-league": 2
};

function getBackgroundImage() {
	// On main pages, use random game image
	var game = games[randint(0, games.length)];
	// On game-specific pages, use that game's images
	for (var g of games) {
		if (decodeURIComponent(location.pathname).includes(g)) {
			game = g;
			break;
		}
	}
	// Format correctly and use correct file path and extension
	return `img/${game}_${randint(1, noImgs[game] + 1)}.jpg`;
}

// Useful background elements
var background = {
	main: document.querySelector("header .background.main"),
	fade: document.querySelector("header .background.fade"),
	header: document.querySelector("header h1")
}

// Set initial background (hopefully quick enough that user does not notice)
background.main.style.backgroundImage = `url("${getBackgroundImage()}")`;

// Change background every 10sec
// NOTE: selection is random so may change to be the same as before
setInterval(() => {
	var image = getBackgroundImage();
	// If is the same, don't select again, just wait another 10 seconds
	// Return early to reduce resource usage
	if (`url("${image}")` == background.main.style.backgroundImage) return;
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
	var el = document.querySelector("header .mousefollower");
	el.style.left = `${goto.x}px`;
	el.style.top = `${goto.y}px`;
}

var lastScrollPos = {
	x: 0,
	y: 0
};

function onScroll(e) {
	// Update mouse follower so it doesnt get stuck when scrolling
	var el = document.querySelector("header .mousefollower");
	var pos = {
		x: parseFloat(el.style.left) || 0,
		y: parseFloat(el.style.top) || 0
	}
	pos.x += document.scrollingElement.scrollLeft - lastScrollPos.x;
	pos.y += document.scrollingElement.scrollTop - lastScrollPos.y;
	doFollowMouse(pos);
	lastScrollPos.x = document.scrollingElement.scrollLeft;
	lastScrollPos.y = document.scrollingElement.scrollTop;
	// Update parallax
	background.main.style.backgroundPositionY = `${-document.scrollingElement.scrollTop / 3}px`;
	background.fade.style.backgroundPositionY = `${-document.scrollingElement.scrollTop / 3}px`;
	background.header.style.top = `calc(50% + ${document.scrollingElement.scrollTop / 3}px)`;
}

function onMouseMove(e) {
	var el = document.querySelector("header .mousefollower");
	// Update mouse follower
	doFollowMouse({
		x: e.pageX - el.getBoundingClientRect().width / 2,
		y: e.pageY - el.getBoundingClientRect().height / 2
	});
}

// Set up listeners
document.addEventListener("scroll", onScroll);
document.addEventListener("mousemove", onMouseMove);

var nav = {
	els: [],
	selectedEl: null,
	pageEl: null,
	listEl: document.querySelector("nav ul"),
	navEl: document.querySelector("nav")
};

var scrollHints = {
	title: document.querySelector("header .scrollhint"),
	navLeft: null,
	navRight: null
}

for (var el of document.querySelectorAll("nav .scrollhint")) {
	if (el.className.includes("invert")) {
		scrollHints.navLeft = el;
	} else {
		scrollHints.navRight = el;
	}
}

function doHighlight(e) {
	nav.selectedEl = e.target;
	var highlight = document.querySelector("nav .highlight");
	var bbox = e.target.getBoundingClientRect();
	highlight.style.width = `${bbox.width}px`;
	highlight.style.left = `${bbox.left}px`;
}

function doInstantHighlight(e) {
	nav.selectedEl = e.target;
	var highlight = document.querySelector("nav .highlight");
	var bbox = e.target.getBoundingClientRect();
	highlight.style.transition = "none";
	highlight.style.width = `${bbox.width}px`;
	highlight.style.left = `${bbox.left}px`;
	setTimeout(() => highlight.style.transition = "left 0.3s, width 0.3s", 10);
}

function onListScroll(e) {
	if (nav.listEl.scrollWidth - nav.listEl.clientWidth) {
		scrollHints.navLeft.style.opacity = e.target.scrollLeft < 10 ? 0 : 1;
		scrollHints.navRight.style.opacity = e.target.scrollLeft >
			nav.listEl.scrollWidth - nav.listEl.clientWidth - 10 ? 0 : 1;
		setTimeout(() => {
			scrollHints.navLeft.style.pointerEvents = e.target.scrollLeft < 10 ? "none" : "auto";
			scrollHints.navRight.style.pointerEvents = e.target.scrollLeft >
				nav.listEl.scrollWidth - nav.listEl.clientWidth - 10 ? "none" : "auto";
		}, 1000);
	} else {
		scrollHints.navLeft.style.opacity = 0;
		scrollHints.navRight.style.opacity = 0;
		scrollHints.navLeft.style.pointerEvents = "none";
		scrollHints.navRight.style.pointerEvents = "none";
	}
}

// Set up navbar
for (var page of navPages) {
	var liEl = document.createElement("li");
	var aEl = document.createElement("a");
	aEl.innerText = toTitleCase(page.replace(/-/g, " ").replace("index", "home").replace("ė", "e"));
	aEl.href = `./${page}.html`;
	aEl.addEventListener("mouseleave", () => doHighlight({
		target: nav.pageEl
	}));
	aEl.addEventListener("blur", () => doHighlight({
		target: nav.pageEl
	}));
	aEl.addEventListener("mouseenter", doHighlight);
	aEl.addEventListener("focus", doHighlight);
	if (decodeURIComponent(location.pathname).includes(page)) {
		aEl.className = "selected";
		// Disable button from navigating
		aEl.addEventListener("click", (e) => e.preventDefault());
		// Mark as disabled for screen-readers
		aEl.setAttribute("aria-disabled", true);
		// Save for later
		nav.selectedEl = nav.pageEl = aEl;
	}
	nav.els.push(aEl);
	liEl.appendChild(aEl);
	nav.listEl.appendChild(liEl);
}

// Start with highlight on selected element
var init = () => {
	nav.pageEl.scrollIntoView({
		behaviour: "auto",
		block: "nearest",
		inline: "nearest"
	});
	doInstantHighlight({
		target: nav.pageEl
	});
	onListScroll({
		target: nav.listEl
	});
}
init();

document.fonts.ready.then(() => {
	if (document.fonts.check('1.6em Silkscreen')) init()
});

document.querySelector("nav ul").addEventListener("scroll", () => doInstantHighlight({
	target: nav.selectedEl
}));
window.addEventListener("resize", () => doInstantHighlight({
	target: nav.selectedEl
}));
scrollHints.title.addEventListener("click", () => document.scrollingElement.scrollBy(0, window.innerHeight - document.scrollingElement.scrollTop));
scrollHints.navLeft.addEventListener("click", () => nav.listEl.scrollBy(-(nav.listEl.scrollWidth / nav.els.length), 0));
scrollHints.navRight.addEventListener("click", () => nav.listEl.scrollBy((nav.listEl.scrollWidth / nav.els.length), 0));
nav.listEl.addEventListener("scroll", onListScroll);
window.addEventListener("resize", () => onListScroll({
	target: nav.listEl
}));
