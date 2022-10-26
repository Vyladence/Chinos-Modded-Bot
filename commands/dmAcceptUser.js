const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('art_accept')
		.setDescription('Accept a user\'s art')
		.addStringOption(option => 
			option.setName('mention')
				.setDescription('The user to accept the art of')
				.setRequired(true)),
	async execute(interaction) {
		if (!interaction.inGuild()) {
			interaction.reply({content:"This interaction cannot be run outside of a server!", ephemeral: true})
			return
		}
		
		if (interaction.memberPermissions.has("ADMINISTRATOR")) {
			try {
				userResolvable = interaction.options.getString('mention');
				user = await interaction.guild.members.fetch(mentionToID(userResolvable.toString()))
			} catch {
				interaction.reply({content:"This user cannot be found!", ephemeral: true})
				return
			}

			const embed = new Discord.MessageEmbed()
			.setColor(0x0001c0)
			.setFooter({text: `Chino\'s Animated: The Official Discord Server`, iconURL: "https://cdn.discordapp.com/icons/1003333305309069394/1942a712f4b200178194d728f8263ec5.webp"})
			.addFields(
				{ name: "Congratulations, welcome to the mod!", value: "We are contacting you to congratulate that we are, in-fact, adding your fanart to the mod. We believe it is high enough effort that we appreciate the time put into it. Have a nice day 👋"}
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