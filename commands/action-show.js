const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('action-show')
    .setDescription('Publicly displays a description and link to an action.').addStringOption(option =>
      option.setName('name')
        .setDescription('The name of the action.')
        .setRequired(true)),

  async execute(interaction, name) {

    const command = interaction.client.commands.get('action');
    await command.execute(interaction, name, false);
    
  },
};