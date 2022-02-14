const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('item-show')
    .setDescription('Publicly displays a description and link to an item.').addStringOption(option =>
      option.setName('name')
        .setDescription('The name of the item.')
        .setRequired(true)),

  async execute(interaction, name) {

    const command = interaction.client.commands.get('item');
    await command.execute(interaction, name, false);
    
  },
};