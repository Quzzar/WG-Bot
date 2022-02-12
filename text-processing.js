
const regexFeatLinkExt = /\((Feat|Ability|Action|Activity):(lvl-([\-0-9]+):|)\s*([^(:]+?)\s*\|\s*(.+?)\s*\)/ig;
const regexFeatLink = /\((Feat|Ability|Action|Activity):(lvl-([\-0-9]+):|)\s*([^(:]+?)\s*\)/ig;
const regexItemLinkExt = /\((Item):\s*([^(:]+?)\s*\|\s*(.+?)\s*\)/ig;
const regexItemLink = /\((Item):\s*([^(:]+?)\s*\)/ig;
const regexSpellLinkExt = /\((Spell):\s*([^(:]+?)\s*\|\s*(.+?)\s*\)/ig;
const regexSpellLink = /\((Spell):\s*([^(:]+?)\s*\)/ig;
const regexLanguageLinkExt = /\((Language):\s*([^(:]+?)\s*\|\s*(.+?)\s*\)/ig;
const regexLanguageLink = /\((Language):\s*([^(:]+?)\s*\)/ig;
const regexTraitLinkExt = /\((Trait):\s*([^(:]+?)\s*\|\s*(.+?)\s*\)/ig;
const regexTraitLink = /\((Trait):\s*([^(:]+?)\s*\)/ig;

module.exports = class TextProcessing {

  static process(text){
    if(text == null) {text = 'Null';}

    const feats = [];
    const items = [];
    const spells = [];
    const traits = [];

    // ---- - Makes horizontal divider within Discord (strike through nothing)
    text = text.replace(/\n\-\-\-\-/g, '~~------------------------------------------~~');

    // __word__ - Makes word italicized for Discord
    text = text.replace(/\_\_(.+?)\_\_/g, '_$1_');

    // * Some Text Here: Other Text
    let regexBulletList = /(\n|^)\* (.*?)\:/g;
    text = text.replace(regexBulletList, '\n**• $2**');

    // ~ Some Text Here: Other Text
    let regexNonBulletList = /(\n|^)\~ (.*?)\:/g;
    text = text.replace(regexNonBulletList, '\n**$2**');

    // :> Some Text
    let regexNonBulletSpacedList = /(\n|^)\:\> /g;
    text = text.replace(regexNonBulletSpacedList, '\n  ');


    // Website Link - [URL]
    let regexURL = /\[(.+?)\]/g;
    text = text.replace(regexURL, '');


    // (Feat: Striking | Strike)
    text = text.replace(regexFeatLinkExt, (match, linkName, lvlTest, lvlNum, innerTextDisplay, innerTextName) => {
      feats.push(innerTextName);
      return innerTextDisplay;
    });
    // (Feat: Strike)
    // Optional (Feat:lvl-0: Quick Alchemy)
    text = text.replace(regexFeatLink, (match, linkName, lvlTest, lvlNum, innerTextName) => {
      feats.push(innerTextName);
      return innerTextName;
    });

    // (Item: Striking | Strike)
    text = text.replace(regexItemLinkExt, (match, linkName, innerTextDisplay, innerTextName) => {
      items.push(innerTextName);
      return innerTextDisplay;
    });
    // (Item: Strike)
    text = text.replace(regexItemLink, (match, linkName, innerTextName) => {
      items.push(innerTextName);
      return innerTextName;
    });

    // (Spell: Striking | Strike)
    text = text.replace(regexSpellLinkExt, (match, linkName, innerTextDisplay, innerTextName) => {
      spells.push(innerTextName);
      return innerTextDisplay;
    });
    // (Spell: Strike)
    text = text.replace(regexSpellLink, (match, linkName, innerTextName) => {
      spells.push(innerTextName);
      return innerTextName;
    });

    // (Language: Gnomish-like | Gnomish)
    text = text.replace(regexLanguageLinkExt, (match, linkName, innerTextDisplay, innerTextName) => {
      return innerTextDisplay;
    });
    // (Language: Gnomish)
    text = text.replace(regexLanguageLink, (match, linkName, innerTextName) => {
      return innerTextName;
    });

    // (Trait: Infusing | Infused)
    text = text.replace(regexTraitLinkExt, (match, linkName, innerTextDisplay, innerTextName) => {
      traits.push(innerTextName);
      return innerTextDisplay;
    });
    // (Trait: Infused)
    text = text.replace(regexTraitLink, (match, linkName, innerTextName) => {
      traits.push(innerTextName);
      return innerTextName;
    });

    // FREE-ACTION
    // REACTION
    // ONE-ACTION
    // TWO-ACTIONS
    // THREE-ACTIONS
    text = text.replace(/FREE-ACTION/g, '◇');
    text = text.replace(/REACTION/g, '⤾');
    text = text.replace(/ONE-ACTION/g, '◆');
    text = text.replace(/TWO-ACTIONS/g, '◆◆');
    text = text.replace(/THREE-ACTIONS/g, '◆◆◆');


    // Critical Success:text
    // Success:text
    // Failure:text
    // Critical Failure:text
    text = text.replace('Critical Success:','**Critical Success** ');
    text = text.replace('Success:','**Success** ');
    text = text.replace('Critical Failure:','**Critical Failure** ');
    text = text.replace('Failure:','**Failure** ');

    return {
      text,

      feats,
      items,
      spells,
      traits,
    };

  }

};