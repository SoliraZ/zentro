// commands/uptime.js
const { EmbedBuilder } = require('discord.js');
const fivem = require('../utils/fivem');

module.exports = {
    name: 'uptime',
    description: 'Afficher le temps de fonctionnement du serveur et du bot',
    async execute(message) {
        const loadingEmbed = new EmbedBuilder()
            .setColor('#FFA500')
            .setTitle('🔄 Calcul du temps de fonctionnement...');

        const loadingMsg = await message.reply({ embeds: [loadingEmbed] });

        try {
            // Uptime du bot
            const botUptime = process.uptime();
            const botDays = Math.floor(botUptime / 86400);
            const botHours = Math.floor((botUptime % 86400) / 3600);
            const botMinutes = Math.floor((botUptime % 3600) / 60);
            const botSeconds = Math.floor(botUptime % 60);

            // Vérifier si le serveur est en ligne
            const serverInfo = await fivem.getServerInfo();

            const uptimeEmbed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('⏰ Temps de Fonctionnement')
                .addFields(
                    {
                        name: '🤖 Bot Discord',
                        value: `\`${botDays}j ${botHours}h ${botMinutes}m ${botSeconds}s\``,
                        inline: true
                    },
                    {
                        name: '📊 Mémoire Utilisée',
                        value: `\`${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB\``,
                        inline: true
                    },
                    {
                        name: '🔧 Version Node.js',
                        value: `\`${process.version}\``,
                        inline: true
                    }
                );

            if (serverInfo.success) {
                uptimeEmbed.addFields(
                    {
                        name: '🟢 Serveur FiveM',
                        value: '✅ En ligne et accessible',
                        inline: true
                    },
                    {
                        name: '📡 Latence API',
                        value: `\`${Date.now() - message.createdTimestamp}ms\``,
                        inline: true
                    },
                    {
                        name: '🎮 Statut',
                        value: '🟢 Opérationnel',
                        inline: true
                    }
                );
            } else {
                uptimeEmbed.addFields(
                    {
                        name: '🔴 Serveur FiveM',
                        value: '❌ Hors ligne ou inaccessible',
                        inline: true
                    },
                    {
                        name: '⚠️ Statut',
                        value: '🔴 Indisponible',
                        inline: true
                    }
                );
                uptimeEmbed.setColor('#FF6B6B');
            }

            uptimeEmbed.setFooter({ text: 'Zentro Bot • System Information' })
                .setTimestamp();

            await loadingMsg.edit({ embeds: [uptimeEmbed] });

        } catch (error) {
            console.error('Erreur uptime command:', error);

            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Erreur')
                .setDescription('Impossible de récupérer les informations système')
                .setFooter({ text: 'Zentro Bot • Error' })
                .setTimestamp();

            await loadingMsg.edit({ embeds: [errorEmbed] });
        }
    }
};
