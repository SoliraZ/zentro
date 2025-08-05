// commands/connect.js
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fivem = require('../utils/fivem');

module.exports = {
    name: 'connect',
    description: 'Obtenir les informations de connexion au serveur',
    async execute(message) {
        const loadingEmbed = new EmbedBuilder()
            .setColor('#FFA500')
            .setTitle('🔄 Vérification du serveur...');

        const loadingMsg = await message.reply({ embeds: [loadingEmbed] });

        try {
            const [serverInfo, playersData] = await Promise.all([
                fivem.getServerInfo(),
                fivem.getPlayers()
            ]);

            const isOnline = serverInfo.success;
            const players = playersData.success ? playersData.data : [];
            const serverData = isOnline ? serverInfo.data : null;

            const connectEmbed = new EmbedBuilder()
                .setTitle('🎮 Connexion au Serveur')
                .setColor(isOnline ? '#00FF00' : '#FF0000');

            if (isOnline) {
                const serverIP = fivem.baseURL.replace('http://', '');

                connectEmbed
                    .setDescription(`**${serverData.vars?.sv_projectName || 'Serveur FiveM'}**\n\n🟢 **Serveur en ligne !**`)
                    .addFields(
                        {
                            name: '🌐 Adresse IP',
                            value: `\`${serverIP}\``,
                            inline: true
                        },
                        {
                            name: '👥 Joueurs connectés',
                            value: `${players.length}/${serverData.vars?.sv_maxSlots || '64'}`,
                            inline: true
                        },
                        {
                            name: '📋 Statut',
                            value: players.length >= (serverData.vars?.sv_maxSlots || 64) ? '🔴 Complet' : '🟢 Places disponibles',
                            inline: true
                        },
                        {
                            name: '🔗 Connexion directe',
                            value: `\`fivem://connect/${serverIP}\``,
                            inline: false
                        }
                    );

                // Ajouter description du serveur si disponible
                if (serverData.vars?.sv_projectDesc) {
                    connectEmbed.addFields({
                        name: '📝 Description',
                        value: serverData.vars.sv_projectDesc.substring(0, 500),
                        inline: false
                    });
                }

                // Boutons d'action
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel('🎮 Se connecter')
                            .setURL(`fivem://connect/${serverIP}`)
                            .setStyle(ButtonStyle.Link),
                        new ButtonBuilder()
                            .setCustomId('refresh_server')
                            .setLabel('🔄 Actualiser')
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId('view_players')
                            .setLabel('👥 Voir joueurs')
                            .setStyle(ButtonStyle.Primary)
                    );

                await loadingMsg.edit({ embeds: [connectEmbed], components: [row] });
            } else {
                connectEmbed
                    .setDescription('🔴 **Serveur hors ligne**\n\nLe serveur est actuellement inaccessible.')
                    .addFields(
                        {
                            name: '⚠️ Informations',
                            value: 'Le serveur pourrait être en maintenance ou redémarrage.',
                            inline: false
                        },
                        {
                            name: '🔄 Que faire ?',
                            value: '• Réessayez dans quelques minutes\n• Contactez les administrateurs\n• Vérifiez les annonces',
                            inline: false
                        }
                    );

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('retry_connection')
                            .setLabel('🔄 Réessayer')
                            .setStyle(ButtonStyle.Primary)
                    );

                await loadingMsg.edit({ embeds: [connectEmbed], components: [row] });
            }

        } catch (error) {
            console.error('Erreur connect command:', error);

            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Erreur de Connexion')
                .setDescription('Impossible de vérifier l\'état du serveur')
                .addFields({
                    name: '🔧 Solution',
                    value: 'Contactez un administrateur si le problème persiste.',
                    inline: false
                })
                .setFooter({ text: 'Zentro Bot • Connection Error' })
                .setTimestamp();

            await loadingMsg.edit({ embeds: [errorEmbed] });
        }
    },

    // Gestionnaire d'interactions pour cette commande
    async handleInteraction(interaction) {
        const { customId } = interaction;

        try {
            console.log(`🔘 ${interaction.user.tag} a cliqué sur le bouton: ${customId}`);

            switch (customId) {
                case 'refresh_server':
                    await this.handleRefreshServer(interaction);
                    break;
                case 'view_players':
                    await this.handleViewPlayers(interaction);
                    break;
                case 'retry_connection':
                    await this.handleRetryConnection(interaction);
                    break;
                default:
                    await interaction.reply({ content: '❌ Bouton non reconnu', ephemeral: true });
            }
        } catch (error) {
            console.error('❌ Erreur lors du traitement de l\'interaction:', error);
            await interaction.reply({
                content: '❌ Une erreur est survenue lors du traitement de cette action.',
                ephemeral: true
            });
        }
    },

    // Fonction pour gérer le rafraîchissement du serveur
    async handleRefreshServer(interaction) {
        await interaction.deferUpdate();

        try {
            const [serverInfo, playersData] = await Promise.all([
                fivem.getServerInfo(),
                fivem.getPlayers()
            ]);

            const isOnline = serverInfo.success;
            const players = playersData.success ? playersData.data : [];
            const serverData = isOnline ? serverInfo.data : null;

            const connectEmbed = new EmbedBuilder()
                .setTitle('🎮 Connexion au Serveur')
                .setColor(isOnline ? '#00FF00' : '#FF0000');

            if (isOnline) {
                const serverIP = fivem.baseURL.replace('http://', '');

                connectEmbed
                    .setDescription(`**${serverData.vars?.sv_projectName || 'Serveur FiveM'}**\n\n🟢 **Serveur en ligne !**`)
                    .addFields(
                        {
                            name: '🌐 Adresse IP',
                            value: `\`${serverIP}\``,
                            inline: true
                        },
                        {
                            name: '👥 Joueurs connectés',
                            value: `${players.length}/${serverData.vars?.sv_maxSlots || '64'}`,
                            inline: true
                        },
                        {
                            name: '📋 Statut',
                            value: players.length >= (serverData.vars?.sv_maxSlots || 64) ? '🔴 Complet' : '🟢 Places disponibles',
                            inline: true
                        },
                        {
                            name: '🔗 Connexion directe',
                            value: `\`fivem://connect/${serverIP}\``,
                            inline: false
                        }
                    );

                if (serverData.vars?.sv_projectDesc) {
                    connectEmbed.addFields({
                        name: '📝 Description',
                        value: serverData.vars.sv_projectDesc.substring(0, 500),
                        inline: false
                    });
                }

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel('🎮 Se connecter')
                            .setURL(`fivem://connect/${serverIP}`)
                            .setStyle(ButtonStyle.Link),
                        new ButtonBuilder()
                            .setCustomId('refresh_server')
                            .setLabel('🔄 Actualiser')
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId('view_players')
                            .setLabel('👥 Voir joueurs')
                            .setStyle(ButtonStyle.Primary)
                    );

                await interaction.editReply({ embeds: [connectEmbed], components: [row] });
            } else {
                connectEmbed
                    .setDescription('🔴 **Serveur hors ligne**\n\nLe serveur est actuellement inaccessible.')
                    .addFields(
                        {
                            name: '⚠️ Informations',
                            value: 'Le serveur pourrait être en maintenance ou redémarrage.',
                            inline: false
                        },
                        {
                            name: '🔄 Que faire ?',
                            value: '• Réessayez dans quelques minutes\n• Contactez les administrateurs\n• Vérifiez les annonces',
                            inline: false
                        }
                    );

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('retry_connection')
                            .setLabel('🔄 Réessayer')
                            .setStyle(ButtonStyle.Primary)
                    );

                await interaction.editReply({ embeds: [connectEmbed], components: [row] });
            }
        } catch (error) {
            console.error('Erreur refresh server:', error);

            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Erreur de Connexion')
                .setDescription('Impossible de vérifier l\'état du serveur')
                .addFields({
                    name: '🔧 Solution',
                    value: 'Contactez un administrateur si le problème persiste.',
                    inline: false
                })
                .setFooter({ text: 'Zentro Bot • Connection Error' })
                .setTimestamp();

            await interaction.editReply({ embeds: [errorEmbed] });
        }
    },

    // Fonction pour gérer l'affichage des joueurs
    async handleViewPlayers(interaction) {
        await interaction.deferUpdate();

        try {
            const playersData = await fivem.getPlayers();

            if (!playersData.success) {
                await interaction.editReply({
                    content: '❌ Impossible de récupérer la liste des joueurs.',
                    ephemeral: true
                });
                return;
            }

            const players = playersData.data;

            if (players.length === 0) {
                const noPlayersEmbed = new EmbedBuilder()
                    .setColor('#FFA500')
                    .setTitle('👥 Joueurs Connectés')
                    .setDescription('Aucun joueur n\'est actuellement connecté au serveur.')
                    .setTimestamp();

                await interaction.editReply({ embeds: [noPlayersEmbed] });
                return;
            }

            const playersEmbed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle(`👥 Joueurs Connectés (${players.length})`)
                .setDescription(players.map((player, index) =>
                    `${index + 1}. **${player.name}** (ID: ${player.id})`
                ).join('\n'))
                .setTimestamp();

            await interaction.editReply({ embeds: [playersEmbed] });
        } catch (error) {
            console.error('Erreur view players:', error);
            await interaction.editReply({
                content: '❌ Une erreur est survenue lors de la récupération des joueurs.',
                ephemeral: true
            });
        }
    },

    // Fonction pour gérer la nouvelle tentative de connexion
    async handleRetryConnection(interaction) {
        await interaction.deferUpdate();
        // Rediriger vers la fonction de rafraîchissement
        await this.handleRefreshServer(interaction);
    }
};
