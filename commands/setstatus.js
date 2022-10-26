const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setstatus')
		.setDescription('Allows admins to set the bot\'s status')
		
		.addStringOption(option => 
			option.setName('type')
			.setDescription('What the text before the status should be')
			.setRequired(false)
			.addChoices( 
				{ name: 'Playing', value: 'PLAYING' },
				{ name: 'Watching', value: 'WATCHING' },
				{ name: 'Listening to', value: 'LISTENING' },
				{ name: 'Default', value: 'Default' },
			))
		.addStringOption(option => 
			option.setName('text')
				.setDescription('What to set the bot\'s status to (optional)')
				.setRequired(false)),
				
	async execute(interaction) {
		if (interaction.memberPermissions.has("ADMINISTRATOR")) {
			statustext = interaction.options.getString('text');
			statustype = interaction.options.getString('type');
			if (statustype == "Default") {
				statustext = "Project: Chino's Chaos"
				statustype = "PLAYING"
			};

			interaction.client.user.setActivity(statustext, {type: statustype});
			console.log(`${interaction.user.username} changed the bot's status to ${statustype} ${statustext}`)
			interaction.reply({content: "Status changed successfully!", ephemeral: true})
		} else {
			interaction.reply({content: `You are not authorized to run this command!`, ephemeral: true})
		}
	},
};