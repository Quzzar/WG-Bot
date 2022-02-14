const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('wg')
    .setDescription('Help command for Wanderer\'s Guide bot.'),

  async execute(interaction) {

    const embed = new MessageEmbed()
      .setColor('#209CEE')
      .setTitle('Help Command')
      .setDescription(`
        **/action** <name>
        _Privately displays a description and link to an action._

        **/action-show** <name>
        _Publicly displays a description and link to an action._

        **/feat** <name>
        _Privately displays a description and link to a feat._

        **/feat-show** <name>
        _Publicly displays a description and link to a feat._

        **/item** <name>
        _Privately displays a description and link to an item._

        **/item-show** <name>
        _Publicly displays a description and link to an item._

        **/spell** <name>
        _Privately displays a description and link to a spell._

        **/spell-show** <name>
        _Publicly displays a description and link to a spell._

        **/trait** <name>
        _Privately displays a description for a trait._

        **/trait-show** <name>
        _Publicly displays a description for a trait._
      `);

    interaction.reply({ embeds: [embed], ephemeral: true });
    
  },
};