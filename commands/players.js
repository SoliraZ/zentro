const { EmbedBuilder } = require('discord.js');
const fivem = require('../utils/fivem');

module.exports = {
    name: 'players',
    description: 'Afficher la liste des joueurs connectés',
    async execute(message) {
        const loadingEmbed = new EmbedBuilder()
            .setColor('#FFA500')
            .setTitle('🔄 Récupération de la liste des joueurs...');

        const loadingMsg = await message.reply({ embeds: [loadingEmbed] });

        try {
            const playersData = await fivem.getPlayers();

            if (!playersData.success) {
                const errorEmbed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('❌ Erreur')
                    .setDescription('Impossible de récupérer la liste des joueurs')
                    .setFooter({ text: 'Zentro Bot • Players List' })
                    .setTimestamp();

                return await loadingMsg.edit({ embeds: [errorEmbed] });
            }

            const players = playersData.data;

            if (players.length === 0) {
                const emptyEmbed = new EmbedBuilder()
                    .setColor('#FFA500')
                    .setTitle('👤 Liste des Joueurs')
                    .setDescription('Aucun joueur connecté actuellement')
                    .setFooter({ text: 'Zentro Bot • Players List' })
                    .setTimestamp();

                return await loadingMsg.edit({ embeds: [emptyEmbed] });
            }

            // Diviser les joueurs en pages si nécessaire
            const playersPerPage = 15;
            const totalPages = Math.ceil(players.length / playersPerPage);
            const page = 1; // Pour l'instant, juste la première page

            const startIndex = (page - 1) * playersPerPage;
            const endIndex = startIndex + playersPerPage;
            const currentPlayers = players.slice(startIndex, endIndex);

            const playersList = currentPlayers.map(player => {
                const ping = player.ping ? `${player.ping}ms` : 'N/A';
                return `\`${player.id.toString().padStart(2, '0')}\` **${player.name}** • ${ping}`;
            }).join('\n');

            const playersEmbed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle(`👥 Joueurs Connectés (${players.length})`)
                .setDescription(playersList)
                .setFooter({
                    text: `Zentro Bot • Page ${page}/${totalPages}`
                })
                .setTimestamp();

            await loadingMsg.edit({ embeds: [playersEmbed] });

        } catch (error) {
            console.error('Erreur players command:', error);

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
