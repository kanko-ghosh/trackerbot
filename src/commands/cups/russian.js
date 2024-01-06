const { ApplicationCommandOptionType, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, MessageCollector, messageLink, PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: 'russian_roulette',
    description: 'get banned with 1/6 chance',
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
    permissionsRequired: [PermissionFlagsBits.ManageRoles],
    botPermissions: [PermissionFlagsBits.Administrator],
    callback: async (client, interaction) => {

        const player = interaction.options.getUser('player')
        const guildplayer = await interaction.guild.members.fetch(player.id)
        await interaction.deferReply();
        const r = Math.floor(Math.random() * 111112);
        if (r%6 == 3){
            await interaction.editReply(`Goodbye <@${player.id}>, you are dead`)
            await guildplayer.kick({reason: "russian roulette"})
        } 
        else
            await interaction.editReply(`You are safe <@${player.id}>`)

    },
};
