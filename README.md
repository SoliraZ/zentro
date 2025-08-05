# Zentro Discord Bot (v1.0)

A modular, advanced Discord bot for FiveM server management, built with Discord.js.

## 🚀 Features

- **Modular command system** (easy to add/extend)
- **Interactive help**: Multi-page, themed, navigable with buttons (◀️ ▶️ ❌)
- **Standardized embed footers** for all messages
- **Admin/management section** for server staff (extensible)
- **.gitignore** for security and clean repo
- **Ready for advanced features** (moderation, resources, stats, etc.)

## 🛠️ Setup Instructions

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
npm start
```

You should see: `🤖 Zentro est en ligne! Connecté en tant que [Your Bot Name]`

## 📦 Project Structure
```
zentro/
├── index.js            # Main bot file
├── commands/           # All command modules (one file per command)
├── utils/embedHelper.js# Utility for standardized embed footers
├── config/             # Configuration files (e.g. FiveM server info)
├── .env                # Environment variables (not committed)
├── .gitignore          # Git ignore rules
├── package.json        # Dependencies and scripts
└── README.md           # This file
```

## 🧩 Available Commands

- `!help` — Interactive, multi-page help (with navigation buttons)
- `!ping` — Check bot latency
- `!hello` — Get a friendly greeting
- `!uptime` — Show bot and server uptime
- `!connect` — Get FiveM server connection info (with interactive buttons)
- `!status` — Show FiveM server status
- `!serverinfo` — Detailed server info
- `!players` — List connected players
- `!findplayer <name>` — Search for a specific player
- `!resources` — List server resources (admin/management section)

> **Note:** The help command now includes an **Administration Serveur** section for all current and future management commands. Only admins should use these commands.

## 🖌️ Standardized Embed Footers
All bot messages use a consistent footer format for clarity and professionalism:
```
Zentro Bot • [Context] • [Type] • [Page X/Y] • Version 1.0
```
- Context: Command or section (e.g. Help, Connect, Players)
- Type: Info, Error, Success, etc.
- Page: Only for multi-page embeds (like help)
- Version: Always shown

## 🧰 How to Add a New Command with Standardized Footer
1. Create a new file in `commands/` (e.g. `mycommand.js`)
2. Use the `EmbedHelper` utility:
   ```js
   const EmbedHelper = require('../utils/embedHelper');
   // ...
   const embed = new EmbedBuilder()
     .setColor('#00FF00')
     .setTitle('My Command')
     .setDescription('...')
     .setFooter(EmbedHelper.createFooter(EmbedHelper.contexts.MYCONTEXT, EmbedHelper.types.INFO))
     .setTimestamp();
   ```
3. Register your command as usual (it will be auto-loaded)

## 🔒 Security Notes
- Never share your bot token publicly
- `.env` is ignored by git (see `.gitignore`)
- Keep your bot token secure and regenerate it if compromised

## 📝 Changelog
- v1.0: Modular structure, interactive help, standardized footers, admin section, improved security

## ❓ Troubleshooting
- **Bot not responding**: Make sure the bot has the correct permissions and is online
- **Token invalid**: Double-check your bot token in the `.env` file
- **Missing intents**: Ensure Message Content Intent is enabled in the Discord Developer Portal 