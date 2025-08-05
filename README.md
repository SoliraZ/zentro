# Discord Bot Project

A simple Discord bot built with Discord.js that responds to basic commands.

## Features

- **!ping** - Check if the bot is responsive
- **!hello** - Get a friendly greeting
- **!help** - Show available commands with an embedded message

## Setup Instructions

### 1. Prerequisites

- Node.js (v16 or higher)
- A Discord account
- A Discord application and bot token

### 2. Discord Bot Setup

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Go to the "Bot" section in the left sidebar
4. Click "Add Bot"
5. Under "Privileged Gateway Intents", enable:
   - Message Content Intent
6. Copy your bot token (you'll need this later)

### 3. Invite Bot to Server

1. Go to the "OAuth2" → "URL Generator" section
2. Select "bot" under "Scopes"
3. Select the following permissions:
   - Send Messages
   - Read Message History
   - Use Slash Commands
4. Copy the generated URL and open it in a browser to invite the bot to your server

### 4. Environment Setup

1. Create a `.env` file in the project root:
   ```
   DISCORD_TOKEN=your_bot_token_here
   ```
2. Replace `your_bot_token_here` with your actual bot token

### 5. Install Dependencies

```bash
npm install
```

### 6. Run the Bot

```bash
node index.js
```

You should see: `🤖 Bot is ready! Logged in as [Your Bot Name]`

## Available Commands

- `!ping` - Bot responds with "🏓 Pong!"
- `!hello` - Bot greets you with "👋 Hello [username]!"
- `!help` - Shows an embedded message with all available commands

## Project Structure

```
zentro/
├── index.js          # Main bot file
├── package.json      # Dependencies and scripts
├── .env              # Environment variables (create this)
└── README.md         # This file
```

## Next Steps

This is a basic Discord bot template. You can extend it by:

1. Adding more commands
2. Implementing slash commands
3. Adding database integration
4. Creating moderation features
5. Adding music playback
6. Implementing role management

## Security Notes

- Never share your bot token publicly
- Add `.env` to your `.gitignore` file
- Keep your bot token secure and regenerate it if compromised

## Troubleshooting

- **Bot not responding**: Make sure the bot has the correct permissions and is online
- **Token invalid**: Double-check your bot token in the `.env` file
- **Missing intents**: Ensure Message Content Intent is enabled in the Discord Developer Portal 