// commands/resources.js
const { EmbedBuilder } = require('discord.js');
const fivem = require('../utils/fivem');

module.exports = {
    name: 'resources',
    description: 'Afficher la liste des resources du serveur',
    async execute(message) {
        const loadingEmbed = new EmbedBuilder()
            .setColor('#FFA500')
            .setTitle('🔄 Récupération des resources...');

        const loadingMsg = await message.reply({ embeds: [loadingEmbed] });

        try {
            const resourcesData = await fivem.getResources();

            if (!resourcesData.success) {
                const errorEmbed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('❌ Erreur')
                    .setDescription('Impossible de récupérer la liste des resources')
                    .setFooter({ text: 'Zentro Bot • Resources List' })
                    .setTimestamp();

                return await loadingMsg.edit({ embeds: [errorEmbed] });
            }

            const resources = resourcesData.data;

            if (resources.length === 0) {
                const emptyEmbed = new EmbedBuilder()
                    .setColor('#FFA500')
                    .setTitle('📦 Resources Serveur')
                    .setDescription('Aucune resource trouvée')
                    .setFooter({ text: 'Zentro Bot • Resources List' })
                    .setTimestamp();

                return await loadingMsg.edit({ embeds: [emptyEmbed] });
            }

            // Diviser par catégories
            const essentialResources = resources.filter(r =>
                r.startsWith('es_') || r.startsWith('esx') || r.startsWith('vrp') ||
                r.includes('core') || r.includes('base')
            );

            const jobResources = resources.filter(r =>
                r.includes('job') || r.includes('work') || r.includes('metier')
            );

            const otherResources = resources.filter(r =>
                !essentialResources.includes(r) && !jobResources.includes(r)
            );

            let description = `**📊 Total: ${resources.length} resources**\n\n`;

            if (essentialResources.length > 0) {
                description += `**🔧 Essentielles (${essentialResources.length}):**\n`;
                description += essentialResources.slice(0, 10).map(r => `• \`${r}\``).join('\n');
                if (essentialResources.length > 10) {
                    description += `\n*... et ${essentialResources.length - 10} autres*\n`;
                }
                description += '\n';
            }

            if (jobResources.length > 0) {
                description += `**💼 Jobs (${jobResources.length}):**\n`;
                description += jobResources.slice(0, 8).map(r => `• \`${r}\``).join('\n');
                if (jobResources.length > 8) {
                    description += `\n*... et ${jobResources.length - 8} autres*`;
                }
                description += '\n';
            }

            if (otherResources.length > 0) {
                description += `**📦 Autres (${otherResources.length}):**\n`;
                description += otherResources.slice(0, 15).map(r => `• \`${r}\``).join('\n');
                if (otherResources.length > 15) {
                    description += `\n*... et ${otherResources.length - 15} autres*`;
                }
            }

            // Limiter la description à 4096 caractères
            if (description.length > 4000) {
                description = description.substring(0, 3950) + '\n*... liste tronquée*';
            }

            const resourcesEmbed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('📦 Resources du Serveur')
                .setDescription(description)
                .setFooter({ text: 'Zentro Bot • Resources List' })
                .setTimestamp();

            await loadingMsg.edit({ embeds: [resourcesEmbed] });

        } catch (error) {
            console.error('Erreur resources command:', error);

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
