const { Client, GatewayIntentBits, Events, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration, // Pour les fonctionnalités de modération
    ],
});

// Collection pour stocker les commandes
client.commands = new Collection();

// Charger les commandes
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

console.log('🔄 Chargement des commandes...');
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.name, command);
    console.log(`✅ Commande chargée: ${command.name}`);
}

client.once(Events.ClientReady, () => {
    console.log(`🤖 Zentro est en ligne! Connecté en tant que ${client.user.tag}`);
    console.log(`📊 Serveurs: ${client.guilds.cache.size} | Utilisateurs: ${client.users.cache.size}`);

    // Statut du bot
    client.user.setPresence({
        activities: [{
            name: 'FiveM Server | !help',
            type: 3 // WATCHING
        }],
        status: 'online'
    });
});

client.on(Events.MessageCreate, async (message) => {
    // Ignorer les bots
    if (message.author.bot) return;

    // Vérifier si le message commence par le préfixe
    if (!message.content.startsWith('!')) return;

    // Parser la commande et les arguments
    const args = message.content.slice(1).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Récupérer la commande
    const command = client.commands.get(commandName);
    if (!command) return;

    try {
        console.log(`🔧 ${message.author.tag} a utilisé la commande: ${commandName}`);
        await command.execute(message, args);
    } catch (error) {
        console.error(`❌ Erreur avec la commande ${commandName}:`, error);
        await message.reply('❌ Une erreur est survenue lors de l\'exécution de cette commande.');
    }
});

// Gestionnaire d'interactions (boutons, menus, etc.)
client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isButton()) return;

    // Ignorer les interactions du help (gérées directement dans la commande)
    if (interaction.customId.startsWith('help_')) {
        return;
    }

    try {
        console.log(`🔘 ${interaction.user.tag} a cliqué sur le bouton: ${interaction.customId}`);

        // Trouver la commande qui gère cette interaction
        const command = client.commands.find(cmd => cmd.handleInteraction);
        if (command) {
            await command.handleInteraction(interaction);
        } else {
            await interaction.reply({ content: '❌ Aucun gestionnaire trouvé pour ce bouton', ephemeral: true });
        }
    } catch (error) {
        console.error('❌ Erreur lors du traitement de l\'interaction:', error);
        await interaction.reply({
            content: '❌ Une erreur est survenue lors du traitement de cette action.',
            ephemeral: true
        });
    }
});

// Gestion des erreurs
client.on('error', (error) => {
    console.error('❌ Erreur Discord:', error);
});

client.on('warn', (warning) => {
    console.warn('⚠️ Avertissement Discord:', warning);
});

// Connexion
client.login(process.env.DISCORD_TOKEN);
