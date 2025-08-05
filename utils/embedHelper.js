// utils/embedHelper.js
const { EmbedBuilder } = require('discord.js');

class EmbedHelper {
    /**
     * Crée un footer standardisé pour tous les embeds
     * @param {string} context - Le contexte de la commande (ex: "Connect", "Players", etc.)
     * @param {string} type - Le type de message (ex: "Success", "Error", "Info")
     * @param {Object} options - Options supplémentaires
     * @param {number} options.currentPage - Page actuelle (pour les embeds multi-pages)
     * @param {number} options.totalPages - Nombre total de pages
     * @returns {Object} - Objet footer pour EmbedBuilder
     */
    static createFooter(context, type = 'Info', options = {}) {
        let footerText = `Zentro Bot • ${context}`;

        // Ajouter le type si ce n'est pas "Info"
        if (type !== 'Info') {
            footerText += ` • ${type}`;
        }

        // Ajouter les informations de pagination si disponibles
        if (options.currentPage && options.totalPages) {
            footerText += ` • Page ${options.currentPage}/${options.totalPages}`;
        }

        // Ajouter la version
        footerText += ' • Version 1.0';

        return { text: footerText };
    }

    /**
     * Crée un embed avec un footer standardisé
     * @param {Object} embedData - Données de l'embed
     * @param {string} context - Contexte de la commande
     * @param {string} type - Type de message
     * @param {Object} options - Options supplémentaires
     * @returns {EmbedBuilder} - Embed avec footer standardisé
     */
    static createEmbed(embedData, context, type = 'Info', options = {}) {
        const embed = new EmbedBuilder(embedData);
        embed.setFooter(this.createFooter(context, type, options));
        embed.setTimestamp();
        return embed;
    }

    /**
     * Types de messages prédéfinis
     */
    static get types() {
        return {
            SUCCESS: 'Success',
            ERROR: 'Error',
            INFO: 'Info',
            WARNING: 'Warning',
            HELP: 'Help',
            SEARCH: 'Search',
            CONNECTION: 'Connection',
            PLAYERS: 'Players',
            RESOURCES: 'Resources',
            SYSTEM: 'System',
            STATUS: 'Status'
        };
    }

    /**
     * Contextes prédéfinis
     */
    static get contexts() {
        return {
            CONNECT: 'Connect',
            PLAYERS: 'Players',
            FINDPLAYER: 'FindPlayer',
            STATUS: 'Status',
            SERVERINFO: 'ServerInfo',
            RESOURCES: 'Resources',
            UPTIME: 'Uptime',
            HELP: 'Help',
            PING: 'Ping',
            HELLO: 'Hello'
        };
    }
}

module.exports = EmbedHelper; 