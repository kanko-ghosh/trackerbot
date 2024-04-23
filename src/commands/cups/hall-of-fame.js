const { ApplicationCommandOptionType, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, MessageCollector, messageLink, EmbedBuilder } = require("discord.js");
const { Player } = require("../../Models/players");
const { ChannelMessage } = require("../../Models/message-channel-mapping");


module.exports = {
    name: 'hall-of-fame',
    description: 'Winners all time',
    // devOnly: Boolean,
    //testOnly: true,
    // options: Object[],
    // deleted: Boolean,
    callback: async (client, interaction) => {
        await interaction.deferReply();

        const ps = await Player.find();
        res = []
        for (var i = 0; i < ps.length; i++) {
            score = 0
            p = ps[i]
            tours = Object.keys(p._doc)
            for (var j = 0; j < tours.length; j++) {
                val = p[tours[j]]
                if (Array.isArray(val) && val.length === 2) {
                    score += val[0][0]
                }
            }
            if (score != 0) res.push([p.id, score, p.isArchived])
        }
        res.sort((a, b) => b[1] - a[1]);


        to_print = ""
        for (var i = 0; i < res.length; i++) {
            if (res[i][2] && res[i][1] < 5) continue
            to_print += `${res[i][1]}×:trophy:${(res[i][2]?"  *":"\t")}\t<@${res[i][0]}>\n`
            if (i == 9)
                to_print += "--------------- TOP 10 ----------------\n"
        }
        if (to_print == ""){
            to_print = "Nothing"
        } else {
            to_print = "# HALL OF FAME\n**Individual honors of UNT members** since reopening (from 06/29/2023)\n-------------------------\n\n" + to_print
        }

        const chanmsg = await ChannelMessage.where({ messagetype: "hall-of-fame" }).findOne()

        var channel = await interaction.guild.channels.fetch(chanmsg.channelid)
        let message
        try{
            message = await channel.messages.fetch(chanmsg.messageid)
        } catch {
            message = null
        }

        if (chanmsg.messageid == null || message == null) {
            var newmsg = await channel.send(to_print)
            chanmsg.messageid = newmsg.id
            await chanmsg.save()
        } else {
            await message.edit(to_print)
        }
        
        // await interaction.reply({embeds: [embed]})
        await interaction.editReply(`Updated in <#${chanmsg.channelid}>`)
    
    }
};
