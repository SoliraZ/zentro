// commands/serverinfo.js
const { EmbedBuilder } = require('discord.js');
const fivem = require('../utils/fivem');

module.exports = {
    name: 'serverinfo',
    description: 'Afficher les informations détaillées du serveur',
    async execute(message) {
        const loadingEmbed = new EmbedBuilder()
            .setColor('#FFA500')
            .setTitle('🔄 Récupération des informations serveur...');

        const loadingMsg = await message.reply({ embeds: [loadingEmbed] });

        try {
            const [serverInfo, playersData, resourcesData] = await Promise.all([
                fivem.getServerInfo(),
                fivem.getPlayers(),
                fivem.getResources()
            ]);

            if (!serverInfo.success) {
                const errorEmbed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('❌ Serveur Hors Ligne')
                    .setDescription('Impossible de récupérer les informations du serveur')
                    .setFooter({ text: 'Zentro Bot • Server Info' })
                    .setTimestamp();

                return await loadingMsg.edit({ embeds: [errorEmbed] });
            }

            const server = serverInfo.data;
            const players = playersData.success ? playersData.data : [];
            const resources = resourcesData.success ? resourcesData.data : [];

            const serverEmbed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('🏠 Informations Serveur')
                .setDescription(`**${server.vars?.sv_projectName || 'Serveur FiveM'}**`)
                .addFields(
                    {
                        name: '👥 Joueurs',
                        value: `${players.length}/${server.vars?.sv_maxSlots || '64'}`,
                        inline: true
                    },
                    {
                        name: '🎮 Version FiveM',
                        value: server.server || 'Inconnue',
                        inline: true
                    },
                    {
                        name: '📋 Resources',
                        value: `${resources.length} chargées`,
                        inline: true
                    },
                    {
                        name: '🌐 IP Serveur',
                        value: `\`${fivem.baseURL.replace('http://', '')}\``,
                        inline: true
                    },
                    {
                        name: '🏷️ Tags',
                        value: server.vars?.tags || 'Aucun',
                        inline: true
                    },
                    {
                        name: '🔒 Sécurité',
                        value: server.vars?.sv_enforceGameBuild ? '🔒 Activée' : '🔓 Désactivée',
                        inline: true
                    }
                )
                .setFooter({ text: 'Zentro Bot • Server Information' })
                .setTimestamp();

            // Ajouter description si elle existe
            if (server.vars?.sv_projectDesc) {
                serverEmbed.addFields({
                    name: '📝 Description',
                    value: server.vars.sv_projectDesc.substring(0, 1024),
                    inline: false
                });
            }

            await loadingMsg.edit({ embeds: [serverEmbed] });

        } catch (error) {
            console.error('Erreur serverinfo command:', error);

            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Erreur')
                .setDescription('Une erreur inattendue s\'est produite')
                .setFooter({ text: 'Zentro Bot • Error' })
                .setTimestamp();

            await loadingMsg.edit({ embeds: [errorEmbed] });
        }
    }
};
