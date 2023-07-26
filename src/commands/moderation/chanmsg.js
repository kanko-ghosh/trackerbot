const { ApplicationCommandOptionType } = require("discord.js");
const { ChannelMessage } = require("../../Models/message-channel-mapping");

module.exports = {
    name: 'chanmsg',
    description: 'lol',
    // devOnly: Boolean,
    //testOnly: true,
    // options: Object[],
    //deleted: true,
    options: [
        {
            name: 'channel',
            description: 'channel',
            required: true,
            type: ApplicationCommandOptionType.Channel,
        },
        {
            name: 'job',
            description: 'todo',
            required: true,
            type: ApplicationCommandOptionType.String,
        },
    ],
    callback: async (client, interaction) => {

        const channel = interaction.options.getChannel('channel')
        const job = interaction.options.getString('job')

        const instance = new ChannelMessage({
            channelid: channel.id,
            messagetype: job
        })
        await instance.save();
        await interaction.reply(`channel <#${channel.id}> added for ${job}`)

    }
};
