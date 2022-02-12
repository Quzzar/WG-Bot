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


// https://discord.com/oauth2/authorize?client_id=354022489245876224&permissions=0&scope=bot%20applications.commands


/* 

CommandInteraction {
  type: 'APPLICATION_COMMAND',
  id: '941926854540021770',
  applicationId: '354022489245876224',
  channelId: '941844403918618644',
  guildId: '485963302216925195',
  user: User {
    id: '296850973450698752',
    bot: false,
    system: false,
    flags: UserFlags { bitfield: 0 },
    username: 'Quzzar',
    discriminator: '7388',
    avatar: '43f5881be822086daa2ce11bccc6c00e',
    banner: undefined,
    accentColor: undefined
  },
  member: GuildMember {
    guild: Guild {
      id: '485963302216925195',
      name: '#CoupleGoals',
      icon: '030f586732ed872a69e7b7ad79c3b9b4',
      features: [],
      commands: [GuildApplicationCommandManager],
      members: [GuildMemberManager],
      channels: [GuildChannelManager],
      bans: [GuildBanManager],
      roles: [RoleManager],
      presences: PresenceManager {},
      voiceStates: [VoiceStateManager],
      stageInstances: [StageInstanceManager],
      invites: [GuildInviteManager],
      scheduledEvents: [GuildScheduledEventManager],
      available: true,
      shardId: 0,
      splash: null,
      banner: null,
      description: null,
      verificationLevel: 'NONE',
      vanityURLCode: null,
      nsfwLevel: 'DEFAULT',
      discoverySplash: null,
      memberCount: 5,
      large: false,
      premiumProgressBarEnabled: false,
      applicationId: null,
      afkTimeout: 300,
      afkChannelId: null,
      systemChannelId: '485963302216925197',
      premiumTier: 'NONE',
      premiumSubscriptionCount: 0,
      explicitContentFilter: 'DISABLED',
      mfaLevel: 'NONE',
      joinedTimestamp: 1644623046934,
      defaultMessageNotifications: 'ALL_MESSAGES',
      systemChannelFlags: [SystemChannelFlags],
      maximumMembers: 500000,
      maximumPresences: null,
      approximateMemberCount: null,
      approximatePresenceCount: null,
      vanityURLUses: null,
      rulesChannelId: null,
      publicUpdatesChannelId: null,
      preferredLocale: 'en-US',
      ownerId: '296850973450698752',
      emojis: [GuildEmojiManager],
      stickers: [GuildStickerManager]
    },
    joinedTimestamp: 1535933328343,
    premiumSinceTimestamp: null,
    nickname: 'My Love',
    pending: false,
    communicationDisabledUntilTimestamp: null,
    _roles: [],
    user: User {
      id: '296850973450698752',
      bot: false,
      system: false,
      flags: [UserFlags],
      username: 'Quzzar',
      discriminator: '7388',
      avatar: '43f5881be822086daa2ce11bccc6c00e',
      banner: undefined,
      accentColor: undefined
    },
    avatar: null
  },
  version: 1,
  memberPermissions: Permissions { bitfield: 2199023255551n },
  locale: 'en-US',
  guildLocale: 'en-US',
  commandId: '941850139067318354',
  commandName: 'feat',
  deferred: false,
  replied: false,
  ephemeral: null,
  webhook: InteractionWebhook { id: '354022489245876224' },
  options: CommandInteractionOptionResolver {
    _group: null,
    _subcommand: null,
    _hoistedOptions: [ [Object] ]
  }
}


SelectMenuInteraction {
  type: 'MESSAGE_COMPONENT',
  id: '941927358317862932',
  applicationId: '354022489245876224',
  channelId: '941844403918618644',
  guildId: '485963302216925195',
  user: User {
    id: '296850973450698752',
    bot: false,
    system: false,
    flags: UserFlags { bitfield: 0 },
    username: 'Quzzar',
    discriminator: '7388',
    avatar: '43f5881be822086daa2ce11bccc6c00e',
    banner: undefined,
    accentColor: undefined
  },
  member: GuildMember {
    guild: Guild {
      id: '485963302216925195',
      name: '#CoupleGoals',
      icon: '030f586732ed872a69e7b7ad79c3b9b4',
      features: [],
      commands: [GuildApplicationCommandManager],
      members: [GuildMemberManager],
      channels: [GuildChannelManager],
      bans: [GuildBanManager],
      roles: [RoleManager],
      presences: PresenceManager {},
      voiceStates: [VoiceStateManager],
      stageInstances: [StageInstanceManager],
      invites: [GuildInviteManager],
      scheduledEvents: [GuildScheduledEventManager],
      available: true,
      shardId: 0,
      splash: null,
      banner: null,
      description: null,
      verificationLevel: 'NONE',
      vanityURLCode: null,
      nsfwLevel: 'DEFAULT',
      discoverySplash: null,
      memberCount: 5,
      large: false,
      premiumProgressBarEnabled: false,
      applicationId: null,
      afkTimeout: 300,
      afkChannelId: null,
      systemChannelId: '485963302216925197',
      premiumTier: 'NONE',
      premiumSubscriptionCount: 0,
      explicitContentFilter: 'DISABLED',
      mfaLevel: 'NONE',
      joinedTimestamp: 1644623046934,
      defaultMessageNotifications: 'ALL_MESSAGES',
      systemChannelFlags: [SystemChannelFlags],
      maximumMembers: 500000,
      maximumPresences: null,
      approximateMemberCount: null,
      approximatePresenceCount: null,
      vanityURLUses: null,
      rulesChannelId: null,
      publicUpdatesChannelId: null,
      preferredLocale: 'en-US',
      ownerId: '296850973450698752',
      emojis: [GuildEmojiManager],
      stickers: [GuildStickerManager]
    },
    joinedTimestamp: 1535933328343,
    premiumSinceTimestamp: null,
    nickname: 'My Love',
    pending: false,
    communicationDisabledUntilTimestamp: null,
    _roles: [],
    user: User {
      id: '296850973450698752',
      bot: false,
      system: false,
      flags: [UserFlags],
      username: 'Quzzar',
      discriminator: '7388',
      avatar: '43f5881be822086daa2ce11bccc6c00e',
      banner: undefined,
      accentColor: undefined
    },
    avatar: null
  },
  version: 1,
  memberPermissions: Permissions { bitfield: 2199023255551n },
  locale: 'en-US',
  guildLocale: 'en-US',
  message: <ref *1> Message {
    channelId: '941844403918618644',
    guildId: '485963302216925195',
    id: '941927296422543452',
    createdTimestamp: 1644643367630,
    type: 'APPLICATION_COMMAND',
    system: false,
    content: '',
    author: ClientUser {
      id: '354022489245876224',
      bot: true,
      system: false,
      flags: [UserFlags],
      username: "Wanderer's Guide",
      discriminator: '5643',
      avatar: '5e86308ce2198a6d56554863aa7f98d9',
      banner: undefined,
      accentColor: undefined,
      verified: true,
      mfaEnabled: true
    },
    pinned: false,
    tts: false,
    nonce: null,
    embeds: [ [MessageEmbed] ],
    components: [ [MessageActionRow] ],
    attachments: Collection(0) [Map] {},
    stickers: Collection(0) [Map] {},
    editedTimestamp: null,
    reactions: ReactionManager { message: [Circular *1] },
    mentions: MessageMentions {
      everyone: false,
      users: Collection(0) [Map] {},
      roles: Collection(0) [Map] {},
      _members: null,
      _channels: null,
      crosspostedChannels: Collection(0) [Map] {},
      repliedUser: null
    },
    webhookId: '354022489245876224',
    groupActivityApplication: null,
    applicationId: '354022489245876224',
    activity: null,
    flags: MessageFlags { bitfield: 0 },
    reference: null,
    interaction: {
      id: '941927294463799326',
      type: 'APPLICATION_COMMAND',
      commandName: 'feat',
      user: [User]
    }
  },
  customId: 'referenced-content',
  componentType: 'SELECT_MENU',
  deferred: false,
  ephemeral: null,
  replied: false,
  webhook: InteractionWebhook { id: '354022489245876224' },
  values: [ 'feat:::Strike' ]
}

*/