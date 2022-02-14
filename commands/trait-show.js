const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('trait-show')
    .setDescription('Publicly displays a description for a trait.').addStringOption(option =>
      option.setName('name')
        .setDescription('The name of the trait.')
        .setRequired(true)),

  async execute(interaction, name) {

    const command = interaction.client.commands.get('trait');
    await command.execute(interaction, name, false);
    
  },
};