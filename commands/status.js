const { EmbedBuilder } = require('discord.js');
const fivem = require('../utils/fivem');

module.exports = {
    name: 'status',
    description: 'Afficher le statut du serveur FiveM',
    async execute(message) {
        const loadingEmbed = new EmbedBuilder()
            .setColor('#FFA500')
            .setTitle('🔄 Vérification du statut...')
            .setDescription('Connexion au serveur en cours...');

        const loadingMsg = await message.reply({ embeds: [loadingEmbed] });

        try {
            const [serverInfo, playersData] = await Promise.all([
                fivem.getServerInfo(),
                fivem.getPlayers()
            ]);

            if (!serverInfo.success) {
                const errorEmbed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('❌ Serveur Hors Ligne')
                    .setDescription('Impossible de se connecter au serveur FiveM')
                    .addFields({
                        name: 'Erreur',
                        value: serverInfo.error,
                        inline: false
                    })
                    .setFooter({ text: 'Zentro Bot • Status Check' })
                    .setTimestamp();

                return await loadingMsg.edit({ embeds: [errorEmbed] });
            }

            const players = playersData.success ? playersData.data : [];
            const serverData = serverInfo.data;

            const statusEmbed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('🟢 Serveur En Ligne')
                .setDescription(`**${serverData.vars?.sv_projectName || 'Serveur FiveM'}**`)
                .addFields(
                    {
                        name: '👥 Joueurs',
                        value: `${players.length}/${serverData.vars?.sv_maxSlots || '64'}`,
                        inline: true
                    },
                    {
                        name: '🌐 Connexion',
                        value: `connect ${fivem.baseURL.replace('http://', '')}`,
                        inline: true
                    },
                    {
                        name: '📈 Version',
                        value: serverData.server || 'Inconnue',
                        inline: true
                    }
                )
                .setFooter({ text: 'Zentro Bot • Dernière vérification' })
                .setTimestamp();

            // Ajouter des joueurs si il y en a
            if (players.length > 0) {
                const playerList = players
                    .slice(0, 10)
                    .map(p => `• ${p.name} (ID: ${p.id})`)
                    .join('\n');

                statusEmbed.addFields({
                    name: `🎮 Joueurs connectés ${players.length > 10 ? '(10 premiers)' : ''}`,
                    value: playerList || 'Aucun joueur',
                    inline: false
                });
            }

            await loadingMsg.edit({ embeds: [statusEmbed] });

        } catch (error) {
            console.error('Erreur status command:', error);

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
