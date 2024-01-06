const { ApplicationCommandOptionType, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, MessageCollector, messageLink, PermissionFlagsBits } = require("discord.js");
const { Player } = require("../../Models/players");

module.exports = {
    name: 'view_status',
    description: 'check status of a player',
    // devOnly: Boolean,
    //testOnly: true,
    // options: Object[],
    // deleted: Boolean,
    options: [
        {
            name: 'player',
            description: 'First player',
            required: true,
            type: ApplicationCommandOptionType.User,
        },
    ],
    callback: async (client, interaction) => {
        await interaction.deferReply();
        
        const player = interaction.options.getUser('player')
        if (player.id == '1065200490293497958'){
          await interaction.editReply("Fuck off, i dont show <@1065200490293497958>\'s status'")
          return;
        }
        if (player.bot) {
            await interaction.editReply("Bots cant play lmao")
            return;
        }

        //check player instance
        const p = await Player.where({ id: player.id }).findOne();
        if (p == null){
            await interaction.editReply("Player isnt availlable in my database")
            return
        } else {
            res = "```"

            res += `${player.tag}${' '.repeat(20-player.tag.length)}| 1st| 2nd| 3rd\n`
            res += "-----------------------------------\n"
            
            tours = Object.keys(p._doc)
            for (var i = 0; i < tours.length; i++){
                key = tours[i]
                val = p[tours[i]]
                if (Array.isArray(val) && val.length === 2 && val[0][0]+val[0][1]+val[0][2] > 0) 
                    res += `${key}${' '.repeat(20-key.length)}|${' '.repeat(4-val[0][0].toString().length)}${val[0][0]}|${' '.repeat(4-val[0][1].toString().length)}${val[0][1]}|${' '.repeat(4-val[0][2].toString().length)}${val[0][2]}\n`
            }
            res += "```\n"
            res += `Current Player: ${p.isArchived ? "NO" : "YES"}`
            await interaction.editReply(res)
        }
    }
};
