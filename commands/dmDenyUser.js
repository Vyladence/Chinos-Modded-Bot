const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('art_deny')
		.setDescription('Deny a user\'s art')
		.addStringOption(option => 
			option.setName('mention')
				.setDescription('The user to deny the art of')
				.setRequired(true)),
	async execute(interaction) {
		if (!interaction.inGuild()) {
			interaction.reply("This interaction cannot be run outside of a server!")
			return
		}

		if (interaction.memberPermissions.has("ADMINISTRATOR")) {
			userResolvable = interaction.options.getString('mention');
			user = await interaction.guild.members.fetch(mentionToID(userResolvable.toString()))

			user.send("We are contacting you to sadly tell you that we will be not adding your fanart to the mod. Have a nice day")
			interaction.reply({content: "Message sent", ephemeral: true})

			try {
				userResolvable = interaction.options.getString('mention');
				user = await interaction.guild.members.fetch(mentionToID(userResolvable.toString()))
			} catch {
				interaction.reply({content:"This user cannot be found!", ephemeral: true})
				return
			}

			const embed = new Discord.MessageEmbed()
			.setColor(0xc00002)
			.setFooter({text: `Chino\'s Animated: The Official Discord Server`, iconURL: "https://cdn.discordapp.com/icons/1003333305309069394/1942a712f4b200178194d728f8263ec5.webp"})
			.addFields(
				{ name: "Sorry, your art is not being added", value: "We are contacting you to sadly tell you that we will be not adding your fanart to the mod. Have a nice day"}
			)

			user.send({embeds: [embed]})
			interaction.reply({content: "Message sent", ephemeral: true})
		} else {
			interaction.reply({content: `You are not authorized to run this command!`, ephemeral: true})
		}
	},
};

function mentionToID (mentionString) {
	num = mentionString.slice(2, mentionString.length)
	num = num.slice(0, num.length - 1)

	return num
}