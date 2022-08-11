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

document.addEventListener("scroll", (e)=>{
    background.main.style.backgroundPositionY = `${-e.target.scrollTop / 2}px`;
    background.fade.style.backgroundPositionY = `${-e.target.scrollTop / 2}px`;
})