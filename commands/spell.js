const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } = require('discord.js');

const fetch = require('node-fetch');
const { apiUrl, apiKey } = require('../config.json');

const Utils = require('../utils.js');
const TextProcessing = require('../text-processing.js');

function removePeriodAtEndOfStr(str){
  if(str.endsWith('.')) {
    return str.substring(0, str.length - 1);
  } else {
    return str;
  }
}

function getHeightenedTextFromCodeName(codeName){
  switch(codeName) {
    case "PLUS_ONE": return "+1";
    case "PLUS_TWO": return "+2";
    case "PLUS_THREE": return "+3";
    case "PLUS_FOUR": return "+4";
    case "LEVEL_2": return "2nd";
    case "LEVEL_3": return "3rd";
    case "LEVEL_4": return "4th";
    case "LEVEL_5": return "5th";
    case "LEVEL_6": return "6th";
    case "LEVEL_7": return "7th";
    case "LEVEL_8": return "8th";
    case "LEVEL_9": return "9th";
    case "LEVEL_10": return "10th";
    case "CUSTOM": return "CUSTOM";
    default: return codeName;
  }
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('spell')
		.setDescription('Gives a description and link to a spell.').addStringOption(option =>
      option.setName('name')
        .setDescription('The name of the spell.')
        .setRequired(true)),

	async execute(interaction, name) {

    await fetch(apiUrl+'spell?name='+encodeURIComponent(name), {
      method: 'GET',
      headers: {
          'Authorization': 'Apikey '+apiKey,
          'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => {

      console.log(data);

      let isFocus = (data.spell.isFocusSpell) ? `Focus ` : ``;
      let traits = (data.spell.level > 0) ? `${isFocus}${data.spell.level})` : `${isFocus}Cantrip)`;
      traits += (data.spell.rarity == 'COMMON') ? `` : ` [${Utils.capitalizeWords(data.spell.rarity)}]`;
      for(const trait of data.traits){
        traits += ` [${trait.name}]`;
      }

      let convertedActions;
      switch(data.spell.cast) {
        case 'FREE_ACTION': convertedActions = '◇'; break;
        case 'REACTION': convertedActions = '⤾'; break;
        case 'ACTION': convertedActions = '◆'; break;
        case 'TWO_ACTIONS': convertedActions = '◆◆'; break;
        case 'THREE_ACTIONS': convertedActions = '◆◆◆'; break;
        case 'ONE_TO_THREE_ACTIONS': convertedActions = '◆ to ◆◆◆'; break;
        case 'ONE_TO_TWO_ACTIONS': convertedActions = '◆ to ◆◆'; break;
        case 'TWO_TO_THREE_ACTIONS': convertedActions = '◆◆ to ◆◆◆'; break;
        case 'TWO_TO_TWO_ROUNDS': convertedActions = '◆◆ to 2 rounds</span>'; break;
        case 'TWO_TO_THREE_ROUNDS': convertedActions = '◆◆ to 3 rounds</span>'; break;
        case 'THREE_TO_TWO_ROUNDS': convertedActions = '◆◆◆ to 2 rounds</span>'; break;
        case 'THREE_TO_THREE_ROUNDS': convertedActions = '◆◆◆ to 3 rounds</span>'; break;
        case 'TWO_ROUNDS': convertedActions = '(2 rounds)'; break;
        case 'THREE_ROUNDS': convertedActions = '(3 rounds)'; break;
        case 'ONE_MINUTE': convertedActions = '(1 minute)'; break;
        case 'FIVE_MINUTES': convertedActions = '(5 minutes)'; break;
        case 'TEN_MINUTES': convertedActions = '(10 minutes)'; break;
        case 'THIRTY_MINUTES': convertedActions = '(30 minutes)'; break;
        case 'ONE_HOUR': convertedActions = '(1 hour)'; break;
        case 'EIGHT_HOURS': convertedActions = '(8 hours)'; break;
        case 'ONE_DAY': convertedActions = '(24 hours)'; break;
        default: convertedActions = ''; break;
      }

      let name = `${data.spell.name} ${convertedActions}`;

      let result = TextProcessing.process(data.spell.description);

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
      if(data.spell.traditions != null){
        const traditions = JSON.parse(data.spell.traditions);
        let traditionStr = '';
        for(const tradition of traditions){
          traditionStr += tradition+', ';
        }
        traditionStr = traditionStr.slice(0, -2);// Trim off that last ', '
        if(traditionStr != '') {
          description += `**Traditions** ${traditionStr}\n`;
        }
      }
      if(data.spell.castingComponents != null){
        const spellComponents = JSON.parse(data.spell.castingComponents);
        let componentsStr = '';
        for(const components of spellComponents){
          componentsStr += components+', ';
        }
        componentsStr = componentsStr.slice(0, -2);// Trim off that last ', '
        description += `**Components** ${componentsStr}\n`;
      }

      // Cost // Trigger // Requirements // 
      let ctrString = '';

      let spellCost = '';
      if(data.spell.cost != null){
        spellCost = '**Cost** '+removePeriodAtEndOfStr(data.spell.cost)+'; ';
      }
      ctrString += spellCost;

      let spellTrigger = '';
      if(data.spell.trigger != null){
        spellTrigger = '**Trigger** '+removePeriodAtEndOfStr(data.spell.trigger)+'; ';
      }
      ctrString += spellTrigger;

      let spellRequirements = '';
      if(data.spell.requirements != null){
        spellRequirements = '**Requirements** '+removePeriodAtEndOfStr(data.spell.requirements)+'; ';
      }
      ctrString += spellRequirements;
      ctrString = ctrString.slice(0, -2);// Trim off that last '; '
      if(ctrString != '') {
        ctrString += '.'; // Add period at end.
        description += `${ctrString}\n`;
      }

      // Range // Area // Targets //
      let ratString = '';

      let spellRange = '';
      if(data.spell.range != null){
        spellRange = '**Range** '+data.spell.range+'; ';
      }
      ratString += spellRange;

      let spellArea = '';
      if(data.spell.area != null){
        spellArea = '**Area** '+data.spell.area+'; ';
      }
      ratString += spellArea;

      let spellTargets = '';
      if(data.spell.targets != null){
        spellTargets = '**Targets** '+data.spell.targets+'; ';
      }
      ratString += spellTargets;
      ratString = ratString.slice(0, -2);// Trim off that last '; '
      if(ratString != '') {
        description += `${ratString}\n`;
      }

      // Saving Throw // Duration //
      let sdString = '';

      let savingThrowType = null;
      switch(data.spell.savingThrow) {
          case 'FORT': savingThrowType = 'Fortitude'; break;
          case 'REFLEX': savingThrowType = 'Reflex'; break;
          case 'WILL': savingThrowType = 'Will'; break;
          case 'BASIC_FORT': savingThrowType = 'basic Fortitude'; break;
          case 'BASIC_REFLEX': savingThrowType = 'basic Reflex'; break;
          case 'BASIC_WILL': savingThrowType = 'basic Will'; break;
          default: break;
      }
      if(savingThrowType != null){
        sdString += '**Saving Throw** '+savingThrowType+'; ';
      }

      let spellDuration = '';
      if(data.spell.duration != null){
        spellDuration = '**Duration** '+data.spell.duration+'; ';
      }
      sdString += spellDuration;
      sdString = sdString.slice(0, -2);// Trim off that last '; '
      if(sdString != '') {
        description += `${sdString}\n`;
      }
      if(description != ''){
        description += `~~------------------------------------------~~\n`;
      }
      description += result.text;

      // Heightening
      let footerText = '';
      if(data.spell.heightenedOneText != null){
        let h_value = getHeightenedTextFromCodeName(data.spell.heightenedOneVal);
        let h_result = TextProcessing.process(data.spell.heightenedOneText);
        if(h_value == 'CUSTOM'){
          footerText += `**Heightened** ${h_result.text}`;
        } else {
          footerText += `**Heightened (${h_value})** ${h_result.text}`;
        }
      }
      if(data.spell.heightenedTwoText != null){
        let h_value = getHeightenedTextFromCodeName(data.spell.heightenedTwoVal);
        let h_result = TextProcessing.process(data.spell.heightenedTwoText);
        footerText += `\n**Heightened (${h_value})** ${h_result.text}`;
      }
      if(data.spell.heightenedThreeText != null){
        let h_value = getHeightenedTextFromCodeName(data.spell.heightenedThreeVal);
        let h_result = TextProcessing.process(data.spell.heightenedThreeText);
        footerText += `\n**Heightened (${h_value})** ${h_result.text}`;
      }
      if(data.spell.heightenedFourText != null){
        let h_value = getHeightenedTextFromCodeName(data.spell.heightenedFourVal);
        let h_result = TextProcessing.process(data.spell.heightenedFourText);
        footerText += `\n**Heightened (${h_value})** ${h_result.text}`;
      }
      if(footerText != ''){
        description += '\n\n'+footerText;
      }

      const embed = new MessageEmbed()
          .setColor('#209CEE')
          .setTitle(name)
          .setURL(`https://wanderersguide.app/browse?content=spell&id=${data.spell.id}`)
          .setDescription(description)
          .setAuthor({name: traits});
      
      let components = null;
      if(selectOptions.length > 0){
        components = [row];
      }
      interaction.reply({ embeds: [embed], components: components, ephemeral: true });
      
    }).catch((error) => {

      console.error(error);
      
      interaction.reply({ content: `:warning: Failed to fetch spell with name "${name}" :warning:`, ephemeral: true });

    });
    
	},
};