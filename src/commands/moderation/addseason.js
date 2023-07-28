const { ApplicationCommandOptionType } = require("discord.js");
const { Season } = require("../../Models/season");

module.exports = {
    name: 'addseason',
    description: 'lol',
    // devOnly: Boolean,
    //testOnly: true,
    // options: Object[],
    //deleted: true,
    options: [
        {
            name: 'n',
            description: 'n',
            required: true,
            type: ApplicationCommandOptionType.Number,
        },
    ],
    callback: async (client, interaction) => {

        const n = interaction.options.getNumber('n')

        const instance = new Season({
            season: n
        })
        await instance.save();
        await interaction.reply(`season set`)

    }
};
