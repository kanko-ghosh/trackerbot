const { ApplicationCommandOptionType, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, MessageCollector, messageLink, PermissionFlagsBits } = require("discord.js");
const { Player } = require("../../Models/players");

module.exports = {
    name: 'fixing_errors',
    description: 'fix errors <name, cup, first, second, third>',
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
        {
            name: 'cup',
            description: 'which major tour?',
            required: true,
            type: ApplicationCommandOptionType.String,
            choices: [
                { name: "asia", value: "asia" },
                { name: "silver_singapore", value: "silver_singapore"},
                { name: "silver_eu", value: "silver_eu" },
                { name: "silver_india", value: "silver_india" },
                { name: "silver_eu_2", value: "silver_eu_2" },
                { name: "gold", value: "gold" },
                { name: "silver_us", value: "silver_us" },
                { name: "america", value: "america" },
                { name: "global", value: "global" },
                { name: "platinum", value: "platinum" },
                { name: "diamond", value: "diamond" },
            ]
        }, 
        {
            name: 'first',
            description: 'first count',
            required: true,
            type: ApplicationCommandOptionType.Number,
        },
        {
            name: 'second',
            description: 'second count',
            required: true,
            type: ApplicationCommandOptionType.Number,
        },
        {
            name: 'third',
            description: 'third count',
            required: true,
            type: ApplicationCommandOptionType.Number,
        },
    ],    
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],
    callback: async (client, interaction) => {

        await interaction.deferReply();

        const player = interaction.options.getUser('player')
        const cup = interaction.options.getString('cup')
        const first = interaction.options.getNumber('first')
        const second = interaction.options.getNumber('second')
        const third = interaction.options.getNumber('third')



        if (player.bot) {
            await interaction.editReply("Bots?? Check")
            return;
        }

        players = [player.id]
        for (i = 0; i < 1; i++){
            const p = await Player.where({ id: players[i] }).findOne();
            
                var v = p[cup]
                v[1][0] += first
                v[1][1] += second
                v[1][2] += third

                p[cup] = 0
                await p.save()
                p[cup] = v
                await p.save()
            
        }

        await interaction.editReply( `UPDATED\t\t${player.tag}\t\tCup: ${cup}\t\tPosition: ${first}, ${second}, ${third}` )
    },
};
