const { SlashCommandBuilder } = require('@discordjs/builders');

const path = require('path')

const channels = require("../components/channels");
const chanTypes = channels.keys;

module.exports = {
    discordDescription: new SlashCommandBuilder()
    .setName(path.parse(__filename).name)
    .setDescription(__filename)
    .addStringOption(option =>
		option.setName('chantype')
			.setDescription('Either botControl or userInteract')
			.setRequired(true)
			.addChoice(chanTypes[0], chanTypes[0])
			.addChoice(chanTypes[1], chanTypes[1])
    ),

	execute: async function(client, interaction)
	{
        const chanType = interaction.options.get("chantype").value;

        if (chanTypes.indexOf(chanType) < 0){
            interaction.reply(`Invalid chantype ${chanType}`);
            return;
        }

        channels.setChannel(chanType, interaction.channel);

		await interaction.reply(`OK! ${interaction.channel} is now ${chanType}`);
	}
}
