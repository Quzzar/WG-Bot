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
        **/{action | feat | item | spell | trait} <name>**
        _Privately displays a description and link to the given content._

        **/{action | feat | item | spell | trait}-show <name>**
        _Publicly displays a description and link to the given content._
        
        **/critical-hit <source>**
        _Displays a random effect from the Critical Hit deck._

        **/critical-fumble <source>**
        _Displays a random effect from the Critical Fumble deck._

        **/hero-point**
        _Displays a random card from the Hero Point deck._
      `);

    interaction.reply({ embeds: [embed], ephemeral: true });
    
  },
};