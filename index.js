const Discord = require("discord.js");
const {Client, Collection, Intents} = require('discord.js');
const bot = new Client({intents: [Intents.FLAGS.GUILD_MEMBERS]});
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const {token, botID} = require("./config/config.json")

console.clear()

// Bot Ready Message - Runs when bot logs in
bot.on("ready", () => {
    console.log(`Bot logged in successfully`);
	bot.user.setActivity("Doin ya mom")
});

// Command Listener
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

bot.commands = new Collection();

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	bot.commands.set(command.data.name, command);
}

bot.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
	const command = bot.commands.get(interaction.commandName);

	if (!command) return;

	try {
		console.log(interaction.commandName + " command recieved, attempting to execute...")
		await command.execute(interaction);
		console.log("Command executed successfully!")
	} catch (error) {
		console.error(error);
		return interaction.reply({ content: 'Invalid command! Do `/help` for a list of commands.', ephemeral: true });
	}
});


// Event Listener
eventFiles = []

try {
	const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
} catch {}

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	try {
		if (event.once) {
			bot.once(event.name.slice(0,-2), (...args) => event.execute(...args));
		} else {
			bot.on(event.name.slice(0,-2), (...args) => event.execute(...args));
		}
	} catch (error) {
		console.log(error)
	}
}

// JVM arguments for registering/deregistering commands

if (process.argv[2] == '-cr') {
	const rest = new REST({ version: '9' }).setToken(token);

	for (const file of commandFiles) {
		const command = require(`./commands/${file}`);
		commands.push(command.data.toJSON());
	}
	
	(async () => {	
		await rest.put(
			Routes.applicationGuildCommands(botID, process.argv[3]),
			{ body: commands },
			);
			
		await console.log('Successfully registered application commands.');
	})();
};

if (process.argv[2] == '-dcr') {
	const rest = new REST({ version: '9' }).setToken(token);
	
	(async () => {	
		await rest.put(
			Routes.applicationGuildCommands(botID, process.argv[3]),
			{ body: {} },
			);
			
		await console.log('Successfully de-registered application commands.');
	})();
};

if (process.argv[2] == '-crg') {
	const rest = new REST({ version: '9' }).setToken(token);

	for (const file of commandFiles) {
		const command = require(`./commands/${file}`);
		commands.push(command.data.toJSON());
	}
	
	(async () => {	
		await rest.put(
			Routes.applicationCommands(botID),
			{ body: commands },
			);
			
		await console.log('Successfully registered global application commands.');
	})();
};

if (process.argv[2] == '-dcrg') {
	const rest = new REST({ version: '9' }).setToken(token);
	
	(async () => {	
		await rest.put(
			Routes.applicationCommands(botID),
			{ body: {} },
			);
			
		await console.log('Successfully de-registered global application commands.');
	})();
};


bot.login(token);
