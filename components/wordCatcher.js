const stringSimilarity = require('string-similarity');

let promiseResolve, promiseReject;


let isRunning = false;
let target;

module.exports =
{
    timeout: 10, // seconds

    start:function(songToFind){
        if (isRunning) return;

        isRunning = true;
        target = songToFind;

        setTimeout(()=>{
            // timeout
            if (isRunning){
                promiseReject(true)
            }
        }, this.timeout * 1000)

        return new Promise(function(resolve, reject){
            promiseResolve = resolve;
            promiseReject = reject;
          });
    },

    endImmediatly:function(){
        promiseReject(false);
    },

    clear:function(){
        isRunning = false;
    },

    receiveMessage:function(message)
    {
        if (isRunning && message.content.length >= 4)
        {
            const targetName = target.name.toLowerCase();
            const targetGame = target.gameName.toLowerCase();
            const targetSeries = target.series.toLowerCase();
            const msg = message.content.toLowerCase();

            if (stringSimilarity.compareTwoStrings(msg, targetName) > 0.7 ||
                stringSimilarity.compareTwoStrings(msg, targetGame) > 0.8 ||
                stringSimilarity.compareTwoStrings(msg, targetSeries) > 0.9){

                promiseResolve(message.author);
            }
        }
    }
}
