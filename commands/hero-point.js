const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } = require('discord.js');

const fetch = require('node-fetch');
const { apiUrl, apiKey } = require('../config.json');

const Utils = require('../utils.js');

let effectsArray = [
  {
      "name": "Protect the Innocent",
      "trigger": "Play when an incapacitated ally or noncombatant NPC within sight takes damage from an attack or effect.",
      "text": "Prevent all of the damage. You take half of the damage they would have taken (in addition to the damage you would normally take from the attack or effect, if any). You can only use this to prevent damage to an ally if that ally is unable to act, such as when they are unconscious or paralyzed."
  },
  {
      "name": "Stoke the Magical Flame",
      "trigger": "Play when you or an ally is Casting a Spell.",
      "text": "Heighten that spell by 1 level. This can’t heighten a spell above the highest level of spell you or the ally can cast."
  },
  {
      "name": "Surge of Speed",
      "trigger": "Play at the start of a creature’s turn.",
      "text": "That creature is quickened on its turn and can use the extra action only to take a single action with the move trait."
  },
  {
      "name": "Healing Prayer",
      "trigger": "Play during your turn.",
      "text": "Select yourself or an ally within reach. The target regains 1d8+8 Hit Points. If you are 7th level or higher, the target regains 2d8+16 Hit Points. If you are 12th level or higher, the target regains 3d8+24 Hit Points."
  },
  {
      "name": "Warding Sign",
      "trigger": "Play at any time.",
      "text": "Select a creature within sight. That creature is immune to misfortune effects for 1 round. If the creature was already affected by a misfortune effect, it ignores that effect for the duration, then the effect returns."
  },
  {
      "name": "Strike True",
      "trigger": "Play when you or an ally are about to make a Strike.",
      "text": "The target rolls twice and takes the higher result. This strike deals an extra die of damage on a hit if the attacker has fewer than half their maximum Hit Points, or two extra dice if they have fewer than one quarter their maximum Hit Points. This is a fortune effect."
  },
  {
      "name": "Endure the Onslaught",
      "trigger": "Play at any time.",
      "text": "Give a creature you can see resistance 5 to all damage until the start of your next turn. If you are 7th level or higher, the resistance is 10, and if you are 12th level or higher, the resistance is 15."
  },
  {
      "name": "Press On",
      "trigger": "Play at the start of your turn.",
      "text": "Until the end of your turn, ignore penalties to checks and DCs from conditions."
  },
  {
      "name": "Drain Power",
      "trigger": "Play when you Activate a magic item that Casts a Spell.",
      "text": "Heighten the spell by 1 level. This can’t heighten the item’s spell above half your level, rounded up. If the item wasn’t consumed on use, you can’t use the item again for 24 hours."
  },
  {
      "name": "Stay in the Fight",
      "trigger": "Play at the start of a turn when you or an ally is affected by an ongoing incapacitation effect.",
      "text": "The creature ignores that incapacitation effect until the end of their turn. This turn doesn’t count as part of the duration for that effect."
  },
  {
      "name": "Reverse Strike",
      "trigger": "Play after you fail an attack roll.",
      "text": "You get a success on the attack roll rather than a failure."
  },
  {
      "name": "Pierce Resistance",
      "trigger": "Play after you learn about a foe’s resistance.",
      "text": "Until the end of your next turn, the foe loses a resistance of your choice. You must be aware of the resistance, either from seeing it shrug off damage from an attack or due to a successful Recall Knowledge check."
  },
  {
      "name": "Grazing Blow",
      "trigger": "Play after a foe hit you with a Strike.",
      "text": "If the foe rolled a critical success, it gets a success instead. If the foe rolled a success, it deals minimum damage instead of rolling for damage."
  },
  {
      "name": "Last Second Sidestep",
      "trigger": "Play when you are targeted by a ranged Strike.",
      "text": "The Strike automatically misses."
  },
  {
      "name": "Shoot Through",
      "trigger": "Play when you are about to make your attack roll for a ranged Strike.",
      "text": "If the path of the Strike goes through another creature’s space before reaching the target, the target is flat-footed against the attack, and the other creature doesn’t provide cover."
  },
  {
      "name": "Reckless Charge",
      "trigger": "Play after taking two consecutive Stride actions.",
      "text": "Make a melee Strike. You are flat-footed until the start of your next turn."
  },
  {
      "name": "Fluid Motion",
      "trigger": "Play at the start of your turn.",
      "text": "For the rest of your turn, you gain a climb Speed and a swim Speed equal to half your Speed. If you make a horizontal Leap, increase the distance jumped by 10 feet."
  },
  {
      "name": "Channel Life force",
      "trigger": "Play on your turn after you have spent all of your Focus Points.",
      "text": "Gain 1 Focus Point that must be spent by the end of your turn or it’s lost. If you use this Focus Point, you become drained 1."
  },
  {
      "name": "Opportune Distraction",
      "trigger": "Play at the start of your turn.",
      "text": "Until the end of your turn, you gain the benefits of greater cover after taking the Hide or Sneak action, allowing you to Hide or Sneak in the open. This effect ends if you do anything other than Hide, Sneak, or Step."
  },
  {
      "name": "Tuck and Roll",
      "trigger": "Play after a creature or hazard hits you with a Strike.",
      "text": "You take the minimum amount of damage and fall prone."
  },
  {
      "name": "Misdirected Attack",
      "trigger": "Play after a foe critically fails on a melee Strike against you.",
      "text": "That foe rerolls the attack, targeting one of its allies within reach."
  },
  {
      "name": "Last Ounce of Strength",
      "trigger": "Play at the start of a turn when you are dying.",
      "text": "You regain consciousness and can act normally on your turn, but you can’t regain Hit Points or remove the dying condition during this turn. At the end of your turn, you fall unconscious and your dying condition increases by 1. Do not attempt a recovery check this turn."
  },
  {
      "name": "Rampage",
      "trigger": "Play at the start of your turn.",
      "text": "Make a Strike against each foe within reach. The multiple attack penalty applies as normal. At the end of these attacks, your turn ends and you are fatigued."
  },
  {
      "name": "Rage and Fury",
      "trigger": "Play when an ally is knocked unconscious or when you take damage from a critical hit.",
      "text": "At the start of your next turn, you enter a rage (+2 damage to melee strikes, -1 AC penalty, no concentrate actions unless they have the rage trait, or use the stats for your rage class feature if you have one). At the end of that turn, if you don’t have the rage class feature, the rage ends and you are fatigued."
  },
  {
      "name": "Hasty Block",
      "trigger": "Play when you are hit by a physical attack, and you have a shield within reach and a free hand.",
      "text": "You Interact to draw and wield the shield and then use it to Shield Block against the attack. After the attack and block are resolved, the shield is torn from your grip and lands in an adjacent space."
  },
  {
      "name": "Run and Shoot",
      "trigger": "Play when you take a Stride action.",
      "text": "You make a ranged Strike at any point during this movement."
  },
  {
      "name": "Aura of Protection",
      "trigger": "Play this after Casting a Spell from your spell slots.",
      "text": "You surround yourself with an aura of residual magic power. Until the start of your next turn, you gain resistance to all damage equal to the level of the spell that you just cast."
  },
  {
      "name": "Magical Reverberation",
      "trigger": "Play this after Casting a Spell.",
      "text": "The spell’s power reverberates in your mind. You can Cast this Spell one additional time without having it prepared or expending a spell slot. If you don’t Cast the Spell by the end of your next turn, it is lost. After Casting the Spell again, you become stupefied 2 for 1 minute."
  },
  {
      "name": "Tumble Past",
      "trigger": "Play after you end your movement adjacent to a creature that is larger than you.",
      "text": "Move to the opposite side of that creature. This movement doesn’t trigger any reactions based on movement."
  },
  {
      "name": "Make Way!",
      "trigger": "Play at the start of a Stride.",
      "text": "During the Stride, you must move in a straight line, but you can attempt to Shove any creature in your way, moving it to an adjacent space out of the way of your movement. Your multiple attack penalty doesn’t apply to any of these free Shove attempts, nor do they increase your multiple attack penalty. If you fail to Shove a creature out of your way, your movement ends."
  },
  {
      "name": "Flash of Insight",
      "trigger": "Play at the start of your turn.",
      "text": "Until the end of your turn, you gain Automatic Knowledge (Core Rulebook 258) for any one skill. If you already have Automatic Knowledge, when you use that feat to attempt a Recall Knowledge check this turn, use an outcome one degree of success better than the result of your roll. If you use this to learn about a creature, you gain twice the number of clues about its abilities."
  },
  {
      "name": "Last Stand",
      "trigger": "Play when you take damage.",
      "text": "Until the start of your next turn, any damage that would reduce you to 0 Hit Points leaves you with 1 Hit Point remaining and gives you the doomed 1 condition, or increases your doomed value by 1 if you’re already doomed. As usual, you die when your doomed condition equals the dying value that would kill you (usually doomed 4)."
  },
  {
      "name": "Spark of Courage",
      "trigger": "Play when you have the frightened condition.",
      "text": "You lose that condition and instead gain a +2 status bonus to attack rolls and skill checks until the end of your next turn."
  },
  {
      "name": "I Hope This Works!",
      "trigger": "Play at the start of your turn.",
      "text": "Once during your turn, you can Activate an item to Cast a Spell, even if you can’t normally cast spells or don’t have that spell on your spell list. After casting this spell, your turn ends."
  },
  {
      "name": "Shake it Off",
      "trigger": "Play at any time.",
      "text": "All persistent damage affecting you immediately comes to an end."
  },
  {
      "name": "Push Through the Pain",
      "trigger": "Play before you attempt a Fortitude save.",
      "text": "You succeed at the saving throw without needing to roll. You gain the drained 1 condition."
  },
  {
      "name": "Dive Out of Danger",
      "trigger": "Play before you attempt a Reflex save.",
      "text": "You succeed at the saving throw without needing to roll. You gain the clumsy 1 condition, which lasts until the next time you get a full night’s rest."
  },
  {
      "name": "Cut Through the Fog",
      "trigger": "Play before you attempt a Will save.",
      "text": "You succeed at the saving throw without needing to roll. You gain the stupefied 1 condition, which lasts until the next time you get a full night’s rest."
  },
  {
      "name": "Ancestral Might",
      "trigger": "Play during your turn.",
      "text": "Until the start of your next turn, you gain a +2 status bonus to checks based on the ability scores that are boosted by your ancestry (ignoring free boosts). If your ancestry only grants free boosts, select one ability score to gain the bonus to instead."
  },
  {
      "name": "Class Might",
      "trigger": "Play during your turn.",
      "text": "Until the start of your next turn you gain a +2 status bonus to checks based on the key ability score of your class. If your class grants a choice for its key ability, select one of those ability scores to gain the bonus."
  },
  {
      "name": "Battle cry",
      "trigger": "Play after making a successful melee attack.",
      "text": "You unleash a terrifying battle cry. Attempt an Intimidation check to Demoralize and compare the result against all enemies within 30 feet."
  },
  {
      "name": "Daring Attempt",
      "trigger": "Play at the start of your turn.",
      "text": "Select one untrained skill. You are trained in that skill until the end of your next turn. If you use that skill before the end of your next turn and succeed at your skill check, you keep this benefit until the end of the combat, or for 1 minute if not in combat."
  },
  {
      "name": "Desperate Swing",
      "trigger": "Play during your turn.",
      "text": "Make a Strike, ignoring the multiple attack penalty. If you roll a critical success, you get a normal success instead. If the attack fails, you release your weapon, or drop prone if you were using an unarmed attack or otherwise can’t release your weapon."
  },
  {
      "name": "Catch Your Breath",
      "trigger": "Play at the end of your turn.",
      "text": "Select yourself or an ally within 30 feet. The creature you choose must have fewer than half their total Hit Points. The creature gains a number of temporary Hit Points equal to twice your level, which last until the end of the combat."
  },
  {
      "name": "Surge of Magic",
      "trigger": "Play during your turn.",
      "text": "Until the end of your turn, you can Activate one magic item that you have already activated once today. This activation doesn’t count against the item’s frequency limit if the limit is once per day, or a shorter increment of time. If the item is a wand, activating it this way doesn’t overcharge it."
  },
  {
      "name": "Distract Foe",
      "trigger": "Play this when a foe within 30 feet makes a melee attack against another creature.",
      "text": "That foe is fascinated with you and it can’t end this condition until it takes a hostile action against you or the combat ends."
  },
  {
      "name": "Impossible Shot",
      "trigger": "Play when making a ranged attack, either with a Strike or a spell.",
      "text": "If you’re attempting a Strike, double the range increment of the weapon or unarmed attack. If you’re Casting a Spell, increase the range of the spell by half."
  },
  {
      "name": "Rending Swipe",
      "trigger": "Play after making two successful consecutive melee Strikes against the same target with two different weapons.",
      "text": "The target takes 1d6 persistent bleed damage and is sickened 1 until the bleeding stops. If you are 7th level or higher, increase the bleed to 2d6. If you are 12th level or higher, increase the bleed to 3d6."
  },
  {
      "name": "Roll Back",
      "trigger": "Play after an attack or effect causes you to become grabbed or knocks you prone.",
      "text": "You roll backward from the attack, landing on your feet. Take a Step away from the source of the attack (if any), and you’re no longer prone or grabbed."
  },
  {
      "name": "Called Foe",
      "trigger": "Play before you make a Strike.",
      "text": "Designate a foe that you can see. You gain a +2 status bonus to attack rolls made against that foe, but you take a -4 status penalty to attack rolls made against any other creature. This lasts until the end of your next turn or until you critically hit the designated foe, whichever comes first."
  },
  {
      "name": "Hold The Line",
      "trigger": "Play during your turn.",
      "text": "Until the start of your next turn, each time an enemy would leave a space adjacent to you while using a move action, it must succeed at an Acrobatics or Athletics check against your Fortitude DC or the move action is disrupted."
  }
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hero-point')
    .setDescription('Displays a random card from the Hero Point deck.'),

  async execute(interaction) {

    let effect = effectsArray[Math.floor(Math.random()*effectsArray.length)];

    let description = effect.trigger;
    description += `~~------------------------------------------~~\n`;
    description += effect.text;

    const embed = new MessageEmbed()
      .setColor('#209CEE')
      .setTitle(Utils.capitalizeWords(effect.name))
      .setURL(`https://paizo.com/products/btq02ao7?Pathfinder-Hero-Point-Deck`)
      .setDescription(description);
    
    interaction.reply({ embeds: [embed], ephemeral: false });

  },
};