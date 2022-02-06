const blindSheet = require('../components/blindsheet');
const webGet = require("../components/webget");
const wordCatcher = require("../components/wordCatcher");
const scores = require("../components/scores");
const channels = require("../components/channels")

module.exports = {
	execute: async function(client, interaction)
	{
        const sheetOriginal = blindSheet.getSheet();

        if (!sheetOriginal){
            interaction.reply("sheet not loaded!");
        }

        const sheet = JSON.parse(JSON.stringify(sheetOriginal));

        if (sheet)
        {
            let entry;
            while (true)
            {
                entry = sheet[Math.floor(Math.random()*sheet.length)];
                console.log(`Checking if entry ${entry.name} (out of ${sheet.length} entries) is valid...`);
                const isAvailable = await webGet.doesYoutubeVideoExist(entry.videoID);

                if (isAvailable)
                {
                    console.log(`Yes`);
                    break;
                }
            }

            await interaction.reply("OK! Digging up a challenge for you")

            await interaction.channel.send(`;;play https://www.youtube.com/watch?v=${entry.videoID}`);

            let winner = await wordCatcher.start(entry)
                .catch((isTimeout)=>{
                    if (isTimeout){
                        wordCatcher.clear();
                        interaction.channel.send(`No one found the answer after ${wordCatcher.timeout} seconds, which was ${entry.name} from ${entry.gameName}!`);
                    }
                });
            
            if (winner){
                await interaction.channel.send(`${winner} got it right! Answer was ${entry.name} from ${entry.gameName}`);
                scores.scorePoint(winner, parseInt(entry.difficulty));
            }

            await interaction.channel.send(`;;stop`);

            wordCatcher.clear();

        }
        else
        {
            await interaction.reply('Sheet is not loaded!!');

        }
	}
}
