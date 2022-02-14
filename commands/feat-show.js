const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('feat-show')
    .setDescription('Publicly displays a description and link to a feat.').addStringOption(option =>
      option.setName('name')
        .setDescription('The name of the feat.')
        .setRequired(true)),

  async execute(interaction, name) {

    const command = interaction.client.commands.get('feat');
    await command.execute(interaction, name, false);
    
  },
};