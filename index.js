const { Client, GatewayIntentBits, Partials, Events } = require('discord.js');
const {
  joinVoiceChannel,
  getVoiceConnection,
  entersState,
  VoiceConnectionStatus
} = require('@discordjs/voice');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

const PREFIX = '!';

// Translates common @discordjs/voice / Discord API errors into
// human-readable messages instead of a raw stack trace.
function formatVoiceJoinPermissionError(error) {
  const message = error?.message?.toLowerCase() || '';

  if (message.includes('missing permissions') || message.includes('missing access')) {
    return '❌ I don\'t have permission to join that voice channel. I need **View Channel** and **Connect** permissions.';
  }
  if (message.includes('opening handshake') || message.includes('timed out')) {
    return '❌ Timed out trying to connect. This can happen if the channel is full, or if Discord\'s voice servers are having issues — try again in a moment.';
  }
  if (message.includes('unknown channel')) {
    return '❌ That voice channel no longer exists.';
  }
  return '❌ I couldn\'t join that voice channel. Please check my permissions and try again.';
}

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot || !message.content.startsWith(PREFIX)) return;
  if (!message.inGuild()) return;

  const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
  const command = args.shift()?.toLowerCase();

  if (command === 'afk') {
    const channel = message.member?.voice?.channel;
    if (!channel) {
      return message.reply('Join a voice channel first.');
    }

    const existingConnection = getVoiceConnection(message.guild.id);
    if (existingConnection) {
      return message.reply('Already connected to a voice channel in this server. Use `!stopafk` first if you want to move.');
    }

    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
      selfDeaf: true,
      selfMute: false
    });

    connection.on('error', (error) => {
      console.error(`[${channel.guild.name}] Voice connection error:`, error);
    });

    try {
      // Wait for the connection to actually reach "Ready" before telling
      // the user it succeeded. joinVoiceChannel() returns immediately with
      // a pending connection — it does NOT guarantee the bot is actually
      // in the channel yet.
      await entersState(connection, VoiceConnectionStatus.Ready, 20_000);
      return message.reply(`Joined ${channel.name} and will stay connected.`);
    } catch (error) {
      // Double-check current state in case it became Ready right after
      // entersState's internal check but before the timeout fired.
      const currentStatus = connection.state.status;
      if (
        currentStatus === VoiceConnectionStatus.Ready ||
        currentStatus === VoiceConnectionStatus.Connecting ||
        currentStatus === VoiceConnectionStatus.Signalling
      ) {
        return message.reply(`Joined ${channel.name} and will stay connected.`);
      }

      console.error(`[${channel.guild.name}] Voice join failed:`, error);
      connection.destroy();
      return message.reply(formatVoiceJoinPermissionError(error));
    }
  }

  if (command === 'stopafk') {
    const connection = getVoiceConnection(message.guild.id);
    if (!connection) {
      return message.reply('The bot is not connected to a voice channel in this server.');
    }
    connection.destroy();
    return message.reply('Disconnected from the voice channel.');
  }
});

const token = process.env.DISCORD_TOKEN;
if (!token) {
  console.error('Missing DISCORD_TOKEN in your .env file.');
  process.exit(1);
}

client.login(token);