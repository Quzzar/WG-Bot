const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } = require('discord.js');

const fetch = require('node-fetch');
const { apiUrl, apiKey } = require('../config.json');

const Utils = require('../utils.js');
const TextProcessing = require('../text-processing.js');


function getConvertedPriceForSize(itemSize, price){
  switch(itemSize) {
    case "TINY":
      return price;
    case "SMALL":
      return price;
    case "MEDIUM":
      return price;
    case "LARGE":
      return price*2;
    case "HUGE":
      return price*4;
    case "GARGANTUAN":
      return price*8;
    default:
      return price;
  }
}

function getConvertedBulkForSize(itemSize, bulk){
  switch(itemSize) {
    case "TINY":
      if(bulk == 0) {
        bulk = 0;
      } else if(bulk <= 0.1){
        bulk = 0;
      } else {
        bulk = bulk/2;
        if(bulk < 1){
          bulk = 0.1;
        }
      }
      return bulk;
    case "SMALL":
      return bulk;
    case "MEDIUM":
      return bulk;
    case "LARGE":
      if(bulk == 0) {
        bulk = 0.1;
      } else if(bulk <= 0.1){
        bulk = 1;
      } else {
        bulk = bulk*2;
      }
      return bulk;
    case "HUGE":
      if(bulk == 0) {
        bulk = 1;
      } else if(bulk <= 0.1){
        bulk = 2;
      } else {
        bulk = bulk*4;
      }
      return bulk;
    case "GARGANTUAN":
      if(bulk == 0) {
        bulk = 2;
      } else if(bulk <= 0.1){
        bulk = 4;
      } else {
        bulk = bulk*8;
      }
      return bulk;
    default:
      return bulk;
  }
}

function getBulkFromNumber(bulkNumber){
  switch(bulkNumber) {
    case 0: return '-';
    case 0.1: return 'L';
    case 0.01: return 'L / 10';
    default: return ''+Utils.round(bulkNumber, 2);
  }
}

function getHandsToString(hands){
  switch(hands) {
    case "NONE":
        return "-";
    case "ONE":
        return "1";
    case "ONE_PLUS":
      return "1+";
    case "TWO":
      return "2";
    default:
        return hands;
  }
}

/* Coins */
function getCoinToString(price) {

  if(price == 0){return "-";}

  let priceObj = {Value: price};
  let cStr = ""; let sStr = ""; let gStr = ""; let pStr = "";

  if(price == 10){
    sStr = processSilver(priceObj);
  } else if(price == 100){
    gStr = processGold(priceObj);
  } else if(price == 1000){
    //pStr = processPlatinum(priceObj);
    gStr = processGold(priceObj);
  } else {
    if(price < 100) { // 99 or less
      cStr = processCopper(priceObj);
    } else if(100 <= price && price < 1000) { // 100 thru 999
      sStr = processSilver(priceObj);
      cStr = processCopper(priceObj);
    } else if(1000 <= price && price < 999999) { // 1000 thru 999,999
      gStr = processGold(priceObj);
      sStr = processSilver(priceObj);
      cStr = processCopper(priceObj);
    } else { // 1,000,000 or greater
      pStr = processPlatinum(priceObj);
      gStr = processGold(priceObj);
      sStr = processSilver(priceObj);
      cStr = processCopper(priceObj);
    }
  }

  let cStr_sStr_ouput = reduceCoinStr(cStr, sStr);
  cStr = cStr_sStr_ouput.current; sStr = cStr_sStr_ouput.upper;

  let sStr_gStr_ouput = reduceCoinStr(sStr, gStr);
  sStr = sStr_gStr_ouput.current; gStr = sStr_gStr_ouput.upper;

  /*let gStr_pStr_ouput = reduceCoinStr(gStr, pStr); // Don't convert down to platinum //
  gStr = gStr_pStr_ouput.current; pStr = gStr_pStr_ouput.upper;*/

  // Add on currency type
  if(pStr!='') {pStr += ' pp';}
  if(gStr!='') {gStr += ' gp';}
  if(sStr!='') {sStr += ' sp';}
  if(cStr!='') {cStr += ' cp';}

  let str = numberWithCommas(pStr);
  if(str != "" && gStr != ""){str += ", ";}
  str += numberWithCommas(gStr);
  if(str != "" && sStr != ""){str += ", ";}
  str += sStr;
  if(str != "" && cStr != ""){str += ", ";}
  str += cStr;

  return str;

}

function processCopper(priceObj) {
  if(priceObj.Value == 0){return '';}
  let copperCount = Math.floor(priceObj.Value / 1);
  priceObj.Value -= copperCount;
  return copperCount+'';
}

function processSilver(priceObj) {
  if(priceObj.Value == 0){return '';}
  let silverCount = Math.floor(priceObj.Value / 10);
  priceObj.Value -= silverCount*10;
  return silverCount+'';
}

function processGold(priceObj) {
  if(priceObj.Value == 0){return '';}
  let goldCount = Math.floor(priceObj.Value / 100);
  priceObj.Value -= goldCount*100;
  return goldCount+'';
}

function processPlatinum(priceObj) {
  if(priceObj.Value == 0){return '';}
  let platinumCount = Math.floor(priceObj.Value / 1000);
  priceObj.Value -= platinumCount*1000;
  return platinumCount+'';
}

function reduceCoinStr(currentCoinStr, upperCoinStr){
  let currentCoin = parseInt(currentCoinStr); if(isNaN(currentCoin)){ currentCoin = 0; }
  let upperCoin = parseInt(upperCoinStr); if(isNaN(upperCoin)){ upperCoin = 0; }
  if(currentCoin !== 0 && currentCoin % 10 === 0){
    upperCoinStr = (upperCoin+(currentCoin/10))+'';
    currentCoinStr = '';
  }
  return { current: currentCoinStr, upper: upperCoinStr };
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('item')
		.setDescription('Gives a description and link to an item.').addStringOption(option =>
      option.setName('name')
        .setDescription('The name of the item.')
        .setRequired(true)),

	async execute(interaction, name) {

    await fetch(apiUrl+'item?name='+encodeURIComponent(name), {
      method: 'GET',
      headers: {
          'Authorization': 'Apikey '+apiKey,
          'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => {

      let traits = (data.item.level == 0 || data.item.level == 999) ? `` : `${data.item.level})`;
      traits += (data.item.rarity == 'COMMON') ? `` : ` [${Utils.capitalizeWords(data.item.rarity)}]`;
      traits += (data.item.size == 'MEDIUM') ? `` : ` [${Utils.capitalizeWords(data.item.size)}]`;
      traits += (data.item.materialType == null) ? `` : ` [${Utils.capitalizeWords(data.item.materialType)}]`;
      for(const trait of data.traits){
        traits += ` [${trait.name}]`;
      }

      let quantity = '';
      if(data.item.quantity > 1){
        quantity =  ` (${data.item.quantity})`;
      }

      let name = `${data.item.name}${quantity}`;

      let result = TextProcessing.process(data.item.description);

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

      if(data.data_weapon != null){

        let weapGroup = '';
        if(data.data_weapon.isRanged == 1){
          if(data.data_weapon.rangedWeaponType == 'CROSSBOW'){
            weapGroup += 'Bow';
          } else {
            weapGroup += Utils.capitalizeWords(data.data_weapon.rangedWeaponType);
          }
        }
        if(data.data_weapon.isMelee == 1){
          if(weapGroup != ''){
            weapGroup += ' & ';
          }
          weapGroup += Utils.capitalizeWords(data.data_weapon.meleeWeaponType);
        }

        let weapCategory = Utils.capitalizeWords(data.data_weapon.category);

        description += `**Category** ${weapCategory}; **Group** ${weapGroup}\n`;

      }

      if(data.data_armor != null){

        let armorCategory = Utils.capitalizeWords(data.data_armor.category);
        let armorGroup = (data.data_armor.armorType == 'N/A') ? '-' : Utils.capitalizeWords(data.data_armor.armorType);

        description += `**Category** ${armorCategory}; **Group** ${armorGroup}\n`;

      }

      let price = getConvertedPriceForSize(data.item.size, data.item.price);
      price = getCoinToString(price);
      if(data.item.quantity > 1){
        price += ' for '+data.item.quantity;
      }
      let bulk = getConvertedBulkForSize(data.item.size, data.item.bulk);
      bulk = getBulkFromNumber(bulk);
      description += `**Price** ${price}; **Bulk** ${bulk}; **Hands** ${getHandsToString(data.item.hands)}\n`;

      if(data.item.usage != null){
        description += `**Usage** ${data.item.usage}\n`;
      }


      if(data.data_weapon != null){

        // Fixes Prisma empty enum for dieType, like for Blowguns
        if(data.data_weapon.dieType == 'EMPTY_ENUM_VALUE'){
          data.data_weapon.dieType = '';
        }

        let damage = data.data_weapon.diceNum+""+data.data_weapon.dieType+" "+data.data_weapon.damageType;

        description += `**Damage** ${damage}\n`;

        if(data.data_weapon.isRanged == 1){

          let reload = data.data_weapon.rangedReload;
          if(reload == 0){ reload = '-'; }
          let range = data.data_weapon.rangedRange;

          description += `**Range** ${range}; **Reload** ${reload}\n`;
        
        }
      }

      if(data.data_armor != null){

        description += `**AC Bonus** ${Utils.signNumber(data.data_armor.acBonus)}; **Dex Cap** ${Utils.signNumber(data.data_armor.dexCap)}\n`;

        let minStrength = (data.data_armor.minStrength == 0) ? '-' : data.data_armor.minStrength+'';
        let checkPenalty = (data.data_armor.checkPenalty == 0) ? '-' : data.data_armor.checkPenalty+'';
        let speedPenalty = (data.data_armor.speedPenalty == 0) ? '-' : data.data_armor.speedPenalty+' ft';

        description += `**Strength** ${minStrength}; **Check Penalty** ${checkPenalty}; **Speed Penalty** ${speedPenalty}\n`;

      }

      if(data.data_storage != null){ // If item is storage,
        let maxBagBulk = data.data_storage.maxBulkStorage;
        let bulkIgnored = data.data_storage.bulkIgnored;
        let bulkIgnoredMessage = "-";
        if(bulkIgnored != 0.0){
          if(bulkIgnored == maxBagBulk){
            bulkIgnoredMessage = "All Items";
          } else {
            bulkIgnoredMessage = "First "+bulkIgnored+" Bulk of Items";
          }
        }

        description += `**Bulk Storage** ${maxBagBulk}; **Bulk Ignored** ${bulkIgnoredMessage}\n`;

      }

      if(data.data_shield != null) { // If item is shield,

        let speedPenalty = (data.data_shield.speedPenalty == 0) ? '-' : data.data_shield.speedPenalty+' ft';
        description += `**AC Bonus** ${Utils.signNumber(data.data_shield.acBonus)}; **Speed Penalty** ${speedPenalty}\n`;

        description += `**Hardness** ${data.item.hardness}; **Hit Points** ${data.item.hitPoints}; **BT** ${data.item.brokenThreshold}\n`;
      }

      if(description != ''){
        description += `~~------------------------------------------~~\n`;
      }
      description += result.text;

      const embed = new MessageEmbed()
          .setColor('#209CEE')
          .setTitle(name)
          .setURL(`https://wanderersguide.app/browse?content=item&id=${data.item.id}`)
          .setDescription(description)
          .setAuthor({name: traits});
      if(data.item.craftRequirements != null){
        embed.setFooter({text: `Craft Requirements: ${data.item.craftRequirements}`});
      }
      
      let components = null;
      if(selectOptions.length > 0){
        components = [row];
      }
      interaction.reply({ embeds: [embed], components: components, ephemeral: true });
      
    }).catch((error) => {
      
      interaction.reply({ content: `:warning: Failed to fetch item with name "${name}" :warning:`, ephemeral: true });

    });
    
	},
};