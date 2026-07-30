# AFK Voice Bot

A Discord bot built with discord.js v14 and @discordjs/voice. It joins a voice channel when you tell it to and stays there until you tell it to leave. Runs off a single bot token, so it works across as many servers as you invite it to, and each server's connection is handled independently.

## What it does

- `!afk` joins the voice channel you're currently sitting in
- `!stopafk` disconnects it from that server's voice channel
- Works in multiple servers at the same time without them interfering with each other
- Waits until the connection actually confirms it's ready before telling you it joined, instead of just assuming it worked
- Gives you a real error message if something goes wrong (missing permissions, timeout, deleted channel) instead of failing silently
- Stays in the channel indefinitely, even if everyone else leaves, until `!stopafk` is used or the bot process itself is stopped

## Requirements

- Node.js v18 or higher
- A Discord bot application and token, created through the [Discord Developer Portal](https://discord.com/developers/applications)
- Message Content Intent turned on for the bot (Developer Portal, your application, Bot, Privileged Gateway Intents)

## Setup

1. Clone the repo
   ```bash
   git clone https://github.com/reshape404-jpg/afk-bot.git
   cd afk-bot
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up your environment variables

   Copy the example file:
   ```bash
   cp .env.example .env
   ```
   Then open `.env` and drop in your token:
   ```
   DISCORD_TOKEN=your_bot_token_here
   ```

4. Start the bot
   ```bash
   node index.js
   ```
   If everything's set up right, you'll see something like:
   ```
   Ready! Logged in as YourBotName#0000
   ```

## Inviting it to a server

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications), open your application, then go to OAuth2 and the URL Generator.
2. Under Scopes, check `bot`.
3. Under Bot Permissions, check:
   - View Channels
   - Connect
   - Speak
4. Copy the generated link and open it. You'll need Manage Server permission on whatever server you're adding it to.

## Commands

| Command    | What it does                                 |
|------------|-----------------------------------------------|
| `!afk`     | Joins the voice channel you're currently in   |
| `!stopafk` | Disconnects the bot from the voice channel    |

## A few things worth knowing

- The bot won't leave an empty voice channel on its own. It just sits there until someone runs `!stopafk`, or the process stops.
- It doesn't remember what channel it was in. If the process restarts for any reason, whether that's a crash, a redeploy, or you stopping it manually, it disconnects from everything and won't rejoin automatically.
- Don't commit your `.env` file. It's already excluded through `.gitignore`, and it's the only thing standing between your bot token and anyone who finds your repo.

## Project structure

```
afk-bot/
├── .env              (not committed, holds your real token)
├── .env.example       (committed, just a placeholder)
├── .gitignore
├── package.json
├── package-lock.json
├── index.js           (the bot itself)
└── README.md