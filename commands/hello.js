const { EmbedBuilder } = require('discord.js');
const EmbedHelper = require('../utils/embedHelper');

module.exports = {
    name: 'hello',
    description: 'Recevoir un salut de Zentro',
    async execute(message) {
        const embed = new EmbedBuilder()
            .setColor('#BB60FC')
            .setTitle('👋 Salut!')
            .setDescription(`Bonjour ${message.author.username}! Je suis **Zentro**, ton assistant FiveM.`)
            .setFooter(EmbedHelper.createFooter(EmbedHelper.contexts.HELLO, EmbedHelper.types.INFO))
            .setTimestamp();

        await message.reply({ embeds: [embed] });
    }
};
