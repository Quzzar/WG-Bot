const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } = require('discord.js');

const fetch = require('node-fetch');
const { apiUrl, apiKey } = require('./../config.json');

const Utils = require('./../utils.js');
const TextProcessing = require('./../text-processing.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('feat')
    .setDescription('Privately displays a description and link to a feat.').addStringOption(option =>
      option.setName('name')
        .setDescription('The name of the feat.')
        .setRequired(true)),

  async execute(interaction, name, ephemeral=true) {

    await fetch(apiUrl+'feat?name='+encodeURIComponent(name), {
      method: 'GET',
      headers: {
          'Authorization': 'Apikey '+apiKey,
          'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => {

      let traits = (data.feat.level > 0) ? `${data.feat.level})` : ``;
      traits += (data.feat.rarity == 'COMMON') ? `` : ` [${Utils.capitalizeWords(data.feat.rarity)}]`;
      for(const trait of data.traits){
        traits += ` [${trait.name}]`;
      }

      let convertedActions;
      if(data.feat.actions == 'ACTION'){
        convertedActions = '◆';
      } else if(data.feat.actions == 'TWO_ACTIONS'){
        convertedActions = '◆◆';
      } else if(data.feat.actions == 'THREE_ACTIONS'){
        convertedActions = '◆◆◆';
      } else if(data.feat.actions == 'REACTION'){
        convertedActions = '⤾';
      } else if(data.feat.actions == 'FREE_ACTION'){
        convertedActions = '◇';
      } else {
        convertedActions = '';
      }

      let name = `${data.feat.name} ${convertedActions}`;

      let result = TextProcessing.process(data.feat.description);

      let selectOptions = [];
      for(const feat of result.feats){
        selectOptions.push({
          label: Utils.capitalizeWords(feat),
          description: 'Action / Feat',
          value: `feat:::${feat}`,
        });
      }
      for(const item of result.items){
        selectOptions.push({
          label: Utils.capitalizeWords(item),
          description: 'Item',
          value: `item:::${item}`,
        });
      }
      for(const spell of result.spells){
        selectOptions.push({
          label: Utils.capitalizeWords(spell),
          description: 'Spell',
          value: `spell:::${spell}`,
        });
      }
      for(const trait of result.traits){
        selectOptions.push({
          label: Utils.capitalizeWords(trait),
          description: 'Trait',
          value: `trait:::${trait}`,
        });
      }
      for(const trait of data.traits){
        selectOptions.push({
          label: Utils.capitalizeWords(trait.name),
          description: 'Trait',
          value: `trait:::${trait.name}`,
        });
      }

      // Remove duplicate entries
      selectOptions = selectOptions.filter((value, index, self) =>
        index === self.findIndex((t) => (
          t.label === value.label
        ))
      );

      const row = new MessageActionRow().addComponents(new MessageSelectMenu()
          .setCustomId('referenced-content')
          .setPlaceholder('Referenced Content')
          .setMinValues(1)
          .setMaxValues(1)
          .addOptions(selectOptions));

      let description = '';
      if(data.feat.prerequisites != null){
        description += `**Prerequisites** ${data.feat.prerequisites}\n`;
      }
      if(data.feat.frequency != null){
        description += `**Frequency** ${data.feat.frequency}\n`;
      }
      if(data.feat.cost != null){
        description += `**Cost** ${data.feat.cost}\n`;
      }
      if(data.feat.trigger != null){
        description += `**Trigger** ${data.feat.trigger}\n`;
      }
      if(data.feat.requirements != null){
        description += `**Requirements** ${data.feat.requirements}\n`;
      }
      if(description != ''){
        description += `~~------------------------------------------~~\n`;
      }
      description += result.text;

      // Limit to only first 4000 characters (nearing message limit size)
      if(description.length > 4000){
        description = description.substring(0,4000);
        description += '...\n\n_Reached max message length. To get full description, visit the link._';
      }

      const embed = new MessageEmbed()
          .setColor('#209CEE')
          .setTitle(name)
          .setURL(`https://wanderersguide.app/browse?content=feat&id=${data.feat.id}`)
          .setDescription(description)
          .setAuthor({name: traits});
      if(data.feat.special != null){
        embed.setFooter({text: `Special: ${data.feat.special}`});
      }
      
      let components = null;
      if(selectOptions.length > 0){
        components = [row];
      }
      interaction.reply({ embeds: [embed], components: components, ephemeral: ephemeral });
      
    }).catch((error) => {

      console.error(error);
      
      interaction.reply({ content: `:warning: Failed to fetch action / feat with name "${name}" :warning:`, ephemeral: ephemeral });

    });
    
  },
};