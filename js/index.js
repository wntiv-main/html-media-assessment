function randint(/* inclusive */min, /* exclusive */max){
    return min + Math.floor(Math.random() * (max - min));
}

function getBackgroundImage(){
    var games = ["LOL", "MC", "RL"];
    var noImgs = {"LOL": 2, "MC": 2, "RL": 2};
    var game = games[randint(0, games.length)];
    return `url("img/${game}_${randint(1, noImgs[game] + 1)}.jpg")`;
}

var background = {
    main: document.querySelector(".title .background.main"),
    fade: document.querySelector(".title .background.fade")
}

background.main.style.backgroundImage = getBackgroundImage();

setInterval(()=>{
    var image = getBackgroundImage();
    background.fade.style.backgroundImage = image;
    setTimeout(()=>{
        background.fade.style.opacity = 1;
        setTimeout(()=>{
            background.main.style.backgroundImage = image;
            setTimeout(()=>{
                background.fade.style.opacity = 0;
            }, 1e3);
        }, 1e3);
    }, 1e3);
}, 10e3);


function doFollowMouse(goto) {
    var el = document.querySelector(".title .mousefollower");
    el.style.left = `${goto.x}px`;
    el.style.top = `${goto.y}px`;
}

var lastScrollPos = { x: 0, y: 0 };
function onScroll(e) {
    target = e.target;
    while (typeof target.scrollTop == 'undefined') { target = target.lastElementChild; }
    var el = document.querySelector(".title .mousefollower");
    var pos = { x: parseFloat(el.style.left), y: parseFloat(el.style.top) }
    pos.x += target.scrollLeft - lastScrollPos.x;
    pos.y += target.scrollTop - lastScrollPos.y;
    doFollowMouse(pos);
    lastScrollPos.x = target.scrollLeft;
    lastScrollPos.y = target.scrollTop;
    background.main.style.backgroundPositionY = `${-target.scrollTop / 2}px`;
    background.fade.style.backgroundPositionY = `${-target.scrollTop / 2}px`;
}

function onMouseMove(e) {
    var el = document.querySelector(".title .mousefollower");
    doFollowMouse({
        x: e.pageX - el.getBoundingClientRect().width / 2,
        y: e.pageY - el.getBoundingClientRect().height / 2
    });
}

document.addEventListener("scroll", onScroll);
document.addEventListener("mousemove", onMouseMove);