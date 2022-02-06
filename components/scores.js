const fs = require('fs');

const scoreFileName = "SCORES.JSON";

let scoreBoard = {};
let isLoaded = false;

module.exports = {
    clearScoreBoard:function(){
        loadIfNotLoaded();
        scoreBoard = {};
    },

    scorePoint: function(user, amount){
        loadIfNotLoaded();

        if (!scoreBoard[user.id])
            scoreBoard[user.id] = 0;

        scoreBoard[user.id] += amount;

        save();
    },

    getScoreBoard: function(){
        loadIfNotLoaded();
        return JSON.parse(JSON.stringify(scoreBoard));
    }
}

function loadIfNotLoaded(){
    if (!isLoaded){
        load();
    }
}

function load(){
    if (fs.existsSync(scoreFileName)){
        scoreBoard = JSON.parse(fs.readFileSync(scoreFileName, "utf8"));
    }
    
    isLoaded = true;
}

function save(){
    fs.writeFileSync(scoreFileName, JSON.stringify(scoreBoard));
}