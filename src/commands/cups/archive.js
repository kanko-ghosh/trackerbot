const { ApplicationCommandOptionType, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, MessageCollector, messageLink, PermissionFlagsBits } = require("discord.js");
const { Player } = require("../../Models/players");

module.exports = {
    name: 'oont_archive',
    description: 'archive/unarchive a player',
    // devOnly: Boolean,
    //testOnly: true,
    // options: Object[],
    // deleted: Boolean,
    options: [
        {
            name: 'player',
            description: 'player',
            required: true,
            type: ApplicationCommandOptionType.User,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],
    callback: async (client, interaction) => {
        const player = interaction.options.getUser('player')
        
        if (player.bot) {
            await interaction.reply("Bots cant play lmao")
            return;
        }

        //check player instance
        const p = await Player.where({ id: player.id }).findOne();
        if (p == null){
            await interaction.reply("Player isnt availlable in my database")
            return
        } else {
            p.isArchived = !p.isArchived
            await p.save()
            await interaction.reply(`${player.tag} archive state is changed`)
        }

    }
};
