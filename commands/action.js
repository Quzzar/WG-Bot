const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('action')
		.setDescription('Gives a description and link to an action.').addStringOption(option =>
      option.setName('name')
        .setDescription('The name of the action.')
        .setRequired(true)),

	async execute(interaction, name) {

    const command = interaction.client.commands.get('feat');
    await command.execute(interaction, name);
    
	},
};