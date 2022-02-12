
module.exports = class Utils {

  static capitalizeWords(str){
    if(str == null){ return null;}
    return str.toLowerCase().replace(/(?:^|\s|["([{_-])+\S/g, match => match.toUpperCase());
  }

  static signNumber(number) {
    return number < 0 ? `${number}` : `+${number}`;
  }

  static round(value, precision) {
    let multiplier = Math.pow(10, precision || 0);
    return Math.floor(value * multiplier) / multiplier;
  }

};