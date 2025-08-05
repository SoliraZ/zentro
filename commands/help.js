const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const EmbedHelper = require('../utils/embedHelper');

module.exports = {
    name: 'help',
    description: 'Afficher la liste des commandes Zentro',
    async execute(message) {
        // Définir les pages de help
        const helpPages = {
            generales: {
                title: '🔧 Commandes Générales',
                description: 'Commandes de base du bot Zentro',
                color: '#FF6B6B',
                commands: [
                    { name: '!ping', description: 'Vérifier la latence du bot', usage: '!ping' },
                    { name: '!help', description: 'Afficher ce message d\'aide', usage: '!help' },
                    { name: '!hello', description: 'Recevoir un salut personnalisé', usage: '!hello' },
                    { name: '!uptime', description: 'Temps de fonctionnement du bot et serveur', usage: '!uptime' }
                ]
            },
            connexion: {
                title: '🎮 Connexion & Statut',
                description: 'Commandes liées au serveur FiveM',
                color: '#4ECDC4',
                commands: [
                    { name: '!connect', description: 'Informations de connexion au serveur', usage: '!connect' },
                    { name: '!status', description: 'Statut du serveur FiveM', usage: '!status' },
                    { name: '!serverinfo', description: 'Informations détaillées du serveur', usage: '!serverinfo' }
                ]
            },
            joueurs: {
                title: '👥 Gestion des Joueurs',
                description: 'Commandes pour gérer et rechercher les joueurs',
                color: '#45B7D1',
                commands: [
                    { name: '!players', description: 'Liste des joueurs connectés', usage: '!players' },
                    { name: '!findplayer', description: 'Rechercher un joueur spécifique', usage: '!findplayer <nom>' }
                ]
            },
            systeme: {
                title: '⚙️ Administration Serveur',
                description: 'Commandes d\'administration et de gestion du serveur',
                color: '#96CEB4',
                commands: [
                    { name: '!resources', description: 'Liste des resources du serveur', usage: '!resources' }
                ]
            }
        };

        // Page actuelle (commence par générales)
        let currentPage = 'generales';
        const pageNames = Object.keys(helpPages);

        // Fonction pour créer l'embed de la page actuelle
        function createHelpEmbed(pageKey) {
            const page = helpPages[pageKey];
            const embed = new EmbedBuilder()
                .setColor(page.color)
                .setTitle(`🤖 Zentro - ${page.title}`)
                .setDescription(page.description)
                .setThumbnail(message.client.user.displayAvatarURL())
                .setFooter(EmbedHelper.createFooter(
                    EmbedHelper.contexts.HELP,
                    EmbedHelper.types.INFO,
                    {
                        currentPage: pageNames.indexOf(pageKey) + 1,
                        totalPages: pageNames.length
                    }
                ))
                .setTimestamp();

            // Ajouter les commandes
            page.commands.forEach(cmd => {
                embed.addFields({
                    name: `\`${cmd.name}\``,
                    value: `**${cmd.description}**\nUsage: \`${cmd.usage}\``,
                    inline: false
                });
            });

            return embed;
        }

        // Créer les boutons de navigation
        function createNavigationButtons(currentPageKey) {
            const currentIndex = pageNames.indexOf(currentPageKey);
            const row = new ActionRowBuilder();

            // Bouton précédent
            const prevButton = new ButtonBuilder()
                .setCustomId('help_prev')
                .setLabel('◀️ Précédent')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(currentIndex === 0);

            // Bouton suivant
            const nextButton = new ButtonBuilder()
                .setCustomId('help_next')
                .setLabel('Suivant ▶️')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(currentIndex === pageNames.length - 1);

            // Bouton fermer
            const closeButton = new ButtonBuilder()
                .setCustomId('help_close')
                .setLabel('❌ Fermer')
                .setStyle(ButtonStyle.Danger);

            row.addComponents(prevButton, nextButton, closeButton);
            return row;
        }

        // Envoyer le message initial
        const helpMsg = await message.reply({
            embeds: [createHelpEmbed(currentPage)],
            components: [createNavigationButtons(currentPage)]
        });

        // Créer un collecteur pour les interactions
        const filter = i => i.user.id === message.author.id;
        const collector = helpMsg.createMessageComponentCollector({ filter, time: 120000 }); // 2 minutes

        collector.on('collect', async (interaction) => {
            try {
                const currentIndex = pageNames.indexOf(currentPage);

                switch (interaction.customId) {
                    case 'help_prev':
                        if (currentIndex > 0) {
                            currentPage = pageNames[currentIndex - 1];
                        }
                        break;
                    case 'help_next':
                        if (currentIndex < pageNames.length - 1) {
                            currentPage = pageNames[currentIndex + 1];
                        }
                        break;
                    case 'help_close':
                        await helpMsg.delete();
                        return;
                }

                // Mettre à jour le message
                await interaction.update({
                    embeds: [createHelpEmbed(currentPage)],
                    components: [createNavigationButtons(currentPage)]
                });
            } catch (error) {
                console.error('Erreur lors de la navigation help:', error);

                // Vérifier si c'est une erreur d'interaction déjà traitée
                if (error.code === 40060) {
                    console.log('Interaction déjà traitée, ignorée');
                    return;
                }

                // Si l'interaction a expiré, essayer de modifier le message directement
                try {
                    await helpMsg.edit({
                        embeds: [createHelpEmbed(currentPage)],
                        components: [createNavigationButtons(currentPage)]
                    });
                } catch (editError) {
                    console.error('Impossible de modifier le message help:', editError);
                }
            }
        });

        collector.on('end', async () => {
            try {
                // Désactiver les boutons après expiration
                const disabledRow = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('help_prev')
                            .setLabel('◀️ Précédent')
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(true),
                        new ButtonBuilder()
                            .setCustomId('help_next')
                            .setLabel('Suivant ▶️')
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(true),
                        new ButtonBuilder()
                            .setCustomId('help_close')
                            .setLabel('❌ Fermer')
                            .setStyle(ButtonStyle.Danger)
                            .setDisabled(true)
                    );

                await helpMsg.edit({ components: [disabledRow] });
            } catch (error) {
                console.log('Message help expiré ou supprimé');
            }
        });
    },

    // Gestionnaire d'interactions pour cette commande
    async handleInteraction(interaction) {
        // Cette méthode sera appelée par le gestionnaire principal si nécessaire
        // Pour l'instant, les interactions sont gérées directement dans execute()
    }
};
