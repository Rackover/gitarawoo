const fs = require('fs');
const path = require('path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Intents } = require("discord.js");
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

const token = process.env.TOKEN;

const rest = new REST({ version: '9' }).setToken(token);

let commands = {};

fs.readdirSync("commands").forEach(file => {
	const cmdName = path.basename(file).toLowerCase().substring(0, file.length-3);
	commands[cmdName] = require("./commands/"+file.substring(0, file.length-3));
	console.log("Loaded command "+cmdName);
	
	if (!commands[cmdName].execute)
	{
		throw new Exception();
	}
});

client.on("ready", async () => {
	console.log("Gitaroo ready and logged in");
	
	// Declare commands
	const guilds = await client.guilds.fetch();
	
	for (const [_, guild] of guilds)
	{
		const guildId = guild.id;
		
		let cmds = [];

		for(key in commands){
			const cmd = commands[key];

			if (cmd.discordDescription){
				cmds.push(cmd.discordDescription);
			}
			else{
				// default command handling
				cmds.push({
					description: key,
					name: key
				});
			}
		}

		await rest.put(
			Routes.applicationGuildCommands(client.user.id, guildId),
			{
				body: cmds 
			},
		);
	}

	// Update channels
	const channels = require("./components/channels");
	await channels.load(client);

	// Update blind sheet
	const sheet = require('./components/blindsheet');
	await sheet.refresh();
});


client.on('interactionCreate', async interaction => {
	
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName && commands[commandName.toLowerCase()])
	{
		const command = commands[commandName.toLowerCase()];
		await command.execute(client, interaction);
	}
});

client.on('messageCreate', async message => {
	const wordCatcher = require('./components/wordCatcher');
	wordCatcher.receiveMessage(message);
});

client.login(token);