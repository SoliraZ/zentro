const { EmbedBuilder } = require('discord.js');
const EmbedHelper = require('../utils/embedHelper');

module.exports = {
    name: 'ping',
    description: 'Vérifier la latence de Zentro',
    async execute(message) {
        const sent = await message.reply('🏓 Calcul du ping...');
        const latency = sent.createdTimestamp - message.createdTimestamp;

        const embed = new EmbedBuilder()
            .setColor('#BB60FC')
            .setTitle('🏓 Pong!')
            .addFields(
                { name: 'Latence', value: `${latency}ms`, inline: true },
                { name: 'API Discord', value: `${Math.round(message.client.ws.ping)}ms`, inline: true }
            )
            .setFooter(EmbedHelper.createFooter(EmbedHelper.contexts.PING, EmbedHelper.types.INFO))
            .setTimestamp();

        await sent.edit({ content: '', embeds: [embed] });
    }
};
