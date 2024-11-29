const { ApplicationCommandOptionType, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, MessageCollector, messageLink, EmbedBuilder } = require("discord.js");
const { Player } = require("../../Models/players");
const { ChannelMessage } = require("../../Models/message-channel-mapping");
const { Season } = require("../../Models/season");

points = {
    "asia": [200, 100, 50],
    "silver_singapore": [120, 60, 30],
    "silver_eu": [120, 60, 30],
    "silver_india": [100, 50, 0],
    "silver_eu_2": [140, 70, 30],
    "gold": [400, 200, 100],
    "silver_us": [120, 60, 30],
    "silver_us_2": [100, 50, 0],
    "america": [200, 100, 50],
    "global": [200, 100, 50],
    "platinum": [1200, 600, 300],
    "diamond": [2000, 1000, 500],
}

module.exports = {
    name: 'score-rankings',
    description: 'Rank shown based on score for current season',
    // devOnly: Boolean,
    //testOnly: true,
    // options: Object[],

    callback: async (client, interaction) => {
        await interaction.deferReply();

        const ps = await Player.find();
        const season = await Season.findOne();

        res = []
        for (var i = 0; i < ps.length; i++) {
            score = 0
            p = ps[i]
            if (p.isArchived) continue;
            tours = Object.keys(p._doc)
            for (var j = 0; j < tours.length; j++) {
                val = p[tours[j]]
                if (Array.isArray(val) && val.length === 2) {
                    score += val[1][0]*points[tours[j]][0]
                    score += val[1][1]*points[tours[j]][1]
                    score += val[1][2]*points[tours[j]][2]
                }
            }
            if (score != 0) res.push([p.id, score])
        }
        res.sort((a, b) => b[1] - a[1]);

        

        to_print = ""
        for (var i = 0; i < res.length; i++) {
            to_print += `${res[i][1]} <:TP:1147077791192457286>\t\t<@${res[i][0]}>\n`
            if (i == 29)
                to_print += "--------------- TOP 30 ----------------\n"
        }
        if (to_print == ""){
            to_print = `Nothing!!`
        }
        to_print = `# Season ${season.season}\n---------------------\n\n` + to_print

        const chanmsg = await ChannelMessage.where({ messagetype: "score-rankings" }).findOne()

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
