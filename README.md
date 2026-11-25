# AFK Voice Bot

A Discord bot that joins your voice channel on command and stays there until you tell it to leave. It is built with Node.js, discord.js v14 and @discordjs/voice. One bot token works across any number of servers, and each server's connection is handled independently.

## Features

- **Join on command:** `!afk` brings the bot into the voice channel you are currently in
- **Leave on command:** `!stopafk` disconnects it from that server's voice channel
- **Multi-server:** the bot can sit in a voice channel in several servers at once without them affecting each other
- **Confirmed joins:** it waits up to 20 seconds for the voice connection to be ready before replying, instead of assuming it worked
- **Clear errors:** missing permissions, connection timeouts and deleted channels each produce a readable message in chat instead of a silent failure
- **Stays put:** it does not leave when everyone else does, and only disconnects on `!stopafk` or when the process stops
- **Self-deafened:** the bot joins deafened, so it does not receive voice audio

## Commands

The command prefix is `!`.

| Command | What it does |
|---|---|
| `!afk` | Join the voice channel you are currently in |
| `!stopafk` | Disconnect from the voice channel in this server |

If the bot is already connected in a server, `!afk` tells you to run `!stopafk` first if you want to move it.

## Tech stack

| Area | Tools |
|---|---|
| Runtime | Node.js 18 or later |
| Bot framework | discord.js 14 |
| Voice | @discordjs/voice, sodium-native, @discordjs/opus |
| Config | dotenv |

## Getting started

### Requirements

- Node.js 18 or later
- A Discord bot application and token from the [Discord Developer Portal](https://discord.com/developers/applications)

### 1. Create the bot and enable the intent

In the Developer Portal, open your application, go to **Bot**, and turn on **Message Content Intent** under Privileged Gateway Intents. The bot reads `!` commands from message text, so it will not respond without this.

### 2. Install

```bash
git clone https://github.com/Mr-cmd-pip/afk-bot.git
cd afk-bot
npm install
```

### 3. Configure

Copy the example environment file and add your token:

```bash
cp .env.example .env
```

```env
DISCORD_TOKEN=your_bot_token_here
```

Never commit your `.env` file. It is already listed in `.gitignore`, and the token is all anyone needs to control your bot.

### 4. Run

```bash
node index.js
```

When it connects, you will see:

```
Ready! Logged in as YourBotName#0000
```

To keep the bot online around the clock, run it on an always-on host or under a process manager such as PM2.

### Invite the bot to a server

1. In the Developer Portal, open your application, then go to **OAuth2** and **URL Generator**.
2. Under Scopes, select `bot`.
3. Under Bot Permissions, select View Channels, Send Messages, Read Message History and Connect.
4. Open the generated link and choose a server. You need the Manage Server permission there.

The bot only needs to listen, so it does not need the Speak permission.

## How it works

- **Per-server connections:** the bot tracks one voice connection per server, so `!afk` and `!stopafk` in one server never touch another
- **Ready check:** after joining, it waits for the connection to reach the ready state, up to 20 seconds, before confirming to the user
- **Error handling:** common join failures are translated into plain messages that tell the user what to fix

## Project structure

```
afk-bot/
├── index.js           # the bot: client setup, commands, error handling
├── package.json
├── package-lock.json
├── .env.example       # token placeholder, safe to commit
├── .gitignore         # excludes .env and node_modules
└── README.md
```

## Troubleshooting

| Problem | Likely cause and fix |
|---|---|
| Bot is online but ignores commands | Message Content Intent is off. Turn it on in the Developer Portal and restart the bot |
| "Used disallowed intents" error on start | Same cause: enable Message Content Intent |
| "I don't have permission to join that voice channel" | Give the bot View Channel and Connect on that channel |
| "Timed out trying to connect" | The channel may be full, or Discord's voice servers may be having issues. Try again shortly |
| "Missing DISCORD_TOKEN" on start | The `.env` file is missing or the variable name is wrong |

## Limitations

- The bot does not remember its channel. If the process restarts, crashes or is redeployed, it disconnects from every server and does not rejoin on its own
- There is no permission check on the commands, so any member who can message in a channel the bot reads can run `!afk` or `!stopafk`
- It joins only the channel of the person who ran the command, and only one channel per server at a time
