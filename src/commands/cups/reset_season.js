const { ApplicationCommandOptionType, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, MessageCollector, messageLink, PermissionFlagsBits } = require("discord.js");
const { Player } = require("../../Models/players");
const { ChannelMessage } = require("../../Models/message-channel-mapping");
const { Season } = require("../../Models/season");


module.exports = {
    name: 'reset_season',
    description: 'Reset season',
    // devOnly: Boolean,
    //testOnly: true,
    // options: Object[],
    // deleted: Boolean,
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],
    callback: async (client, interaction) => {

        await interaction.deferReply();

        const ps = await Player.find();
        for (var i = 0; i < ps.length; i++) {
            p = ps[i]
            tours = Object.keys(p._doc)
            for (var j = 0; j < tours.length; j++) {
                val = p[tours[j]]
                if (Array.isArray(val) && val.length === 2) {
                    val[1] = [0, 0, 0]
                }
            }
            await p.save()
        }

        const s = await Season.findOne();
        s.season += 1
        await s.save()


        await ChannelMessage.updateMany({ messagetype: { $ne: 'hall-of-fame' } }, { $unset: { messageid: 1 } })
        await interaction.editReply(`season reset done, new season: ${s.season}`)
    }
};
