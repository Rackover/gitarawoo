
const blindSheet = require("../components/blindsheet");
const webGet = require("../components/webget");
require("../components/util")

let isBusy = false;

module.exports = {
	execute: async function (client, interaction) {
		if (isBusy) return;

		isBusy = true;

		const sheet = blindSheet.getSheet();
		if (sheet == undefined) {
			await interaction.reply("The sheet is not ready! Something went wrong during a refresh?");
		}
		else {
			let advance0100 = 0;
			const prefix = "OK, starting a diagnostic check-up...";
			let message = await interaction.reply({content:prefix, fetchReply:true});

			let missingVideos = [];

			const entries = sheet.length;

			for (i in sheet){
				const advance01 = i/entries;
				const currentAdvance0100 = Math.ceil(advance01 * 100);
				
				const entry = sheet[i];

				const id = entry.videoID;

				if (id)
				{
					const videoIsAvailable = await webGet.doesYoutubeVideoExist(id);

					if (!videoIsAvailable){
						missingVideos.push({
							name: entry["name"],
							game: entry["gameName"]
						})
					}
				}

				if (currentAdvance0100 != advance0100){
					advance0100 = currentAdvance0100;
					await message.edit(prefix + advance0100 + "%");
				}
			}


			await message.edit(prefix + "100%");
			if (missingVideos.length > 0){
				await interaction.channel.send(`${missingVideos.length} dead links collected:`);
				
				let output = "";
				
				for(i in missingVideos){
					const video = missingVideos[i];
					const addition =`**${video.name}** from **${video.game}**\n`;
					if (output.length + addition.length > 2000){
						await interaction.channel.send(output);
						output = "";
					}

					output += addition;
				}
				
				await interaction.channel.send(output);
			}

			await interaction.channel.send("Diagnostic finished!");
		}

		isBusy = false;
	}
}
