const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('spell-show')
    .setDescription('Publicly displays a description and link to a spell.').addStringOption(option =>
      option.setName('name')
        .setDescription('The name of the spell.')
        .setRequired(true)),

  async execute(interaction, name) {

    const command = interaction.client.commands.get('spell');
    await command.execute(interaction, name, false);
    
  },
};