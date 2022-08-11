function randint(/* inclusive */min, /* exclusive */max){
    return min + Math.floor(Math.random() * (max - min));
}

var games = ["LOL", "MC", "RL"];
var noImgs = {"LOL": 2, "MC": 2, "RL": 2};

var game = games[randint(0, games.length)];
document.querySelector(".title .background").style.backgroundImage = `url("img/${game}_${randint(1, noImgs[game] + 1)}.jpg")`;