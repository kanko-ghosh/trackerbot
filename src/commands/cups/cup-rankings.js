const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const { Player } = require("../../Models/players");
const { ChannelMessage } = require("../../Models/message-channel-mapping");
const { Season } = require("../../Models/season");

tours = [
    "asia",
    "silver_singapore",
    "silver_eu",
    "silver_india",
    "silver_eu_2",
    "gold",
    "america",
    "silver_us",
    "silver_us_2",
    "global",
    "platinum",
    "diamond",
]

module.exports = {
    name: 'cup-rankings',
    description: 'Top 3 positions are shown!',
    // devOnly: Boolean,
    //testOnly: true,
    // options: Object[],
    // deleted: Boolean,

    callback: async (client, interaction) => {
        await interaction.deferReply();

        const season = await Season.findOne();
    
        const ps = await Player.find();

        const embedList = []
        for (i = 0; i < tours.length; i++){
            to_print = ""
            res = []
            for (var j = 0; j < ps.length; j++) {
                one = 0
                two = 0
                three = 0
                p = ps[j]
                if (p.isArchived) continue;

                val = p[tours[i]]
                if (Array.isArray(val) && val.length === 2) {
                    one += val[1][0]
                    two += val[1][1]
                    three += val[1][2]
                }
                if (one+two+three != 0) res.push([p.id, one, two, three])

            }
            res.sort((a, b) => {
                if (b[1] !== a[1]) {
                    return b[1] - a[1]; // Sort by the second element in descending order
                } else if (b[2] !== a[2]) {
                    return b[2] - a[2]; // If equal, sort by the first element in descending order
                } else {
                    return b[3] - a[3];
                }
            });

            temp = ""
            for (var k = 0; k < res.length; k++) {
                temp += `${res[k][1]}x`🏆`  ${res[k][2]}x`🥈`  ${res[k][3]}x`🥉`  \t\t<@${res[k][0]}>\n`
            }
            if (temp != ""){
                to_print += "---------------------\n";
                to_print += temp + "\n"
                const embed = new EmbedBuilder()
                .setTitle(tours[i])
                .setDescription(to_print)
                embedList.push(embed)
            }

        }


        const chanmsg = await ChannelMessage.where({ messagetype: "cup-rankings" }).findOne()

        var channel = await interaction.guild.channels.fetch(chanmsg.channelid)
        let message
        try {
            message = await channel.messages.fetch(chanmsg.messageid)
        } catch {
            message = null
        }

        if (embedList.length == 0){
            if (chanmsg.messageid == null || message == null) {
                var newmsg = await channel.send(`# Season ${season.season}\nNothing yet`)
                chanmsg.messageid = newmsg.id
                await chanmsg.save()
            } else {
                await message.edit(`# Season ${season.season}\nNothing yet`)
            }
        } else {
            if (chanmsg.messageid == null || message == null) {
                var newmsg = await channel.send({content: `# Season ${season.season}`, embeds: embedList})
                chanmsg.messageid = newmsg.id
                await chanmsg.save()
            } else {
                await message.edit({content: `# Season ${season.season}`, embeds: embedList})
            }
        }


        // await interaction.reply({embeds: [embed]})
        await interaction.editReply(`Updated in <#${chanmsg.channelid}>`)

        
    }
};
