// commands/findplayer.js
const { EmbedBuilder } = require('discord.js');
const fivem = require('../utils/fivem');

module.exports = {
    name: 'findplayer',
    description: 'Rechercher un joueur spécifique',
    async execute(message, args) {
        if (!args.length) {
            const helpEmbed = new EmbedBuilder()
                .setColor('#FFA500')
                .setTitle('❓ Usage')
                .setDescription('**Utilisation:** `!findplayer <nom_joueur>`')
                .addFields({
                    name: '📝 Examples',
                    value: '`!findplayer John`\n`!findplayer "John Doe"`',
                    inline: false
                })
                .setFooter({ text: 'Zentro Bot • Help' });

            return message.reply({ embeds: [helpEmbed] });
        }

        const searchQuery = args.join(' ').toLowerCase();

        const loadingEmbed = new EmbedBuilder()
            .setColor('#FFA500')
            .setTitle(`🔍 Recherche de "${searchQuery}"...`);

        const loadingMsg = await message.reply({ embeds: [loadingEmbed] });

        try {
            const playersData = await fivem.getPlayers();

            if (!playersData.success) {
                const errorEmbed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('❌ Erreur')
                    .setDescription('Impossible d\'accéder à la liste des joueurs')
                    .setFooter({ text: 'Zentro Bot • Search Error' })
                    .setTimestamp();

                return await loadingMsg.edit({ embeds: [errorEmbed] });
            }

            const players = playersData.data;
            const foundPlayers = players.filter(player =>
                player.name.toLowerCase().includes(searchQuery)
            );

            if (foundPlayers.length === 0) {
                const notFoundEmbed = new EmbedBuilder()
                    .setColor('#FF6B6B')
                    .setTitle('🔍 Recherche')
                    .setDescription(`Aucun joueur trouvé pour: **"${searchQuery}"**`)
                    .addFields({
                        name: '💡 Suggestions',
                        value: '• Vérifiez l\'orthographe\n• Utilisez une partie du nom\n• Le joueur est peut-être hors ligne',
                        inline: false
                    })
                    .setFooter({ text: 'Zentro Bot • No Results' })
                    .setTimestamp();

                return await loadingMsg.edit({ embeds: [notFoundEmbed] });
            }

            const resultsList = foundPlayers.map(player => {
                const ping = player.ping ? `${player.ping}ms` : 'N/A';
                return `\`ID ${player.id.toString().padStart(2, '0')}\` **${player.name}** • Ping: ${ping}`;
            }).join('\n');

            const resultsEmbed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle(`🔍 Résultats (${foundPlayers.length})`)
                .setDescription(`**Recherche pour:** "${searchQuery}"\n\n${resultsList}`)
                .setFooter({ text: 'Zentro Bot • Search Results' })
                .setTimestamp();

            await loadingMsg.edit({ embeds: [resultsEmbed] });

        } catch (error) {
            console.error('Erreur findplayer command:', error);

            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Erreur')
                .setDescription('Une erreur s\'est produite lors de la recherche')
                .setFooter({ text: 'Zentro Bot • Error' })
                .setTimestamp();

            await loadingMsg.edit({ embeds: [errorEmbed] });
        }
    }
};
