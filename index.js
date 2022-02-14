const { token } = require('./config.json');

// Express Server (for WG API)
const express = require('express');
//const fetch = require('node-fetch');

const app = express();

const port = 8000;
app.listen(port, function () {
    console.log("API Server is running on "+ port +" port");
});

// Discord Bot
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.once('ready', () => {
  client.user.setActivity('/wg', { type: 'LISTENING' });
});

client.on('interactionCreate', async interaction => {

  if(interaction.isCommand()) {

    const command = client.commands.get(interaction.commandName);

    if (!command) return;
  
    try {
      await command.execute(interaction, interaction.options.getString('name'));
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }

  } else if(interaction.isSelectMenu()){

    if(interaction.customId == 'referenced-content'){

      if(interaction.values.length > 0){

        let valueParts = interaction.values[0].split(':::');
        let type = valueParts[0];
        let name = valueParts[1];

        const command = client.commands.get(type);
        await command.execute(interaction, name);

      }

    }

  }

});

client.login(token);