const { ApplicationCommandOptionType, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, MessageCollector, messageLink, PermissionFlagsBits } = require("discord.js");
const { Player } = require("../../Models/players");

module.exports = {
    name: 'cup_placement',
    description: 'add if you are in top 3 in any major tournament',
    // devOnly: Boolean,
    //testOnly: true,
    // options: Object[],
    // deleted: Boolean,
    options: [
        {
            name: 'player1',
            description: 'First player',
            required: true,
            type: ApplicationCommandOptionType.User,
        },
        {
            name: 'player2',
            description: 'Second player',
            required: true,
            type: ApplicationCommandOptionType.User,
        },
        {
            name: 'player3',
            description: 'Third player',
            required: true,
            type: ApplicationCommandOptionType.User,
        },
        {
            name: 'position',
            description: 'first, second or third?',
            required: true,
            type: ApplicationCommandOptionType.Number,
            choices: [
                { name: "first", value: 1 },
                { name: "second", value: 2 },
                { name: "third", value: 3 },
            ]
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
        }
    ],    
    // permissionsRequired: [PermissionFlagsBits.Administrator],
    // botPermissions: [PermissionFlagsBits.Administrator],
    callback: async (client, interaction) => {
        const player1 = interaction.options.getUser('player1')
        const player2 = interaction.options.getUser('player2')
        const player3 = interaction.options.getUser('player3')

        const cup = interaction.options.getString('cup')
        const position = interaction.options.getNumber('position')


        if (player1.bot || player2.bot || player3.bot) {
            await interaction.reply("Bots cant win lmao")
            return;
        }
        if (player1.id === player2.id || player2.id === player3.id || player1.id === player3.id) {
            await interaction.reply("same user mentioned")
            return;
        }
        
        // await interaction.reply(`You entered players: <@${player1.tag}>,<@${player2.tag}> and <@${player3.tag}>\nCup: ${cup}\nPosition: ${position}`)

        //save player instance

        players = [player1.id, player2.id, player3.id]
        for (i = 0; i < 3; i++){
            const p = await Player.where({ id: players[i] }).findOne();
            if (p == null){
                arr = [[0, 0, 0], [0, 0, 0]]
                arr[0][position-1] = 1
                arr[1][position-1] = 1
                const player = new Player({
                    id: players[i],
                    [cup]: arr,
                })
                await player.save()
            } else {
                var v = p[cup]
                v[0][position-1] += 1
                v[1][position-1] += 1

                p.isArchived = false
                p[cup] = 0
                await p.save()
                p[cup] = v
                await p.save()
            }
        }

        await interaction.reply( `Saved player status\n${player1.tag} | ${player2.tag} | ${player3.tag}\nCup: ${cup}\nPosition: ${position}` )
    },
};
