function randint(/* inclusive */min, /* exclusive */max){
    return min + Math.floor(Math.random() * (max - min));
}

var games = ["league-of-legends", "minėcraft", "rocket-league"];
function getBackgroundImage(){
    var noImgs = {"league-of-legends": 2, "minėcraft": 4, "rocket-league": 2};
    var game = games[randint(0, games.length)];
    for(var g of games){
        if(decodeURIComponent(location.pathname).indexOf(g) >= 0){
            game = g;
        }
    }
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
            background.fade.style.opacity = 0;
        }, 1e3);
    }, 1e3);
}, 10e3);

document.addEventListener("scroll", (e)=>{
    background.main.style.backgroundPositionY = `${-e.target.scrollTop / 2}px`;
    background.fade.style.backgroundPositionY = `${-e.target.scrollTop / 2}px`;
});