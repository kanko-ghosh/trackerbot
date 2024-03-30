const { ApplicationCommandOptionType, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, MessageCollector, messageLink, PermissionFlagsBits } = require("discord.js");
const { Player } = require("../../Models/players");

module.exports = {
    name: 'transfer',
    description: 'transfer the ownership of a player to another user',
    options: [
        {
            name: 'from',
            description: 'Current owner of the player',
            required: true,
            type: ApplicationCommandOptionType.User,
        },
        {
            name: 'to',
            description: 'New owner of the player',
            required: true,
            type: ApplicationCommandOptionType.User,
        },
    ],    
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],
    callback: async (client, interaction) => {

        await interaction.deferReply();

        const From = interaction.options.getUser('from')
        const To = interaction.options.getUser('to')


        if (From.bot || To.bot) {
            await interaction.editReply("Bots cant win lmao")
            return;
        }
        if (From.id === To.id) {
            await interaction.editReply("same user mentioned")
            return;
        }
        
        const player = await Player.where({ id: From.id }).findOne();
        if (player == null){
            await interaction.editReply("Player not found")
            return;
        }
        player.id = To.id
        await player.save()
        await interaction.editReply(`Transfered player <@${From.id}> to <@${To.id}>`)
    }
};
