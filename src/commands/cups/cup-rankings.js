const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const { Player } = require("../../Models/players");

tours = [
    "asia",
    "silver_singapore",
    "silver_eu",
    "silver_india",
    "silver_eu_2",
    "gold",
    "america",
    "silver_us",
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
    options: [
        {
            name: 'all_time',
            description: 'true, if data for all time is required, else false',
            required: true,
            type: ApplicationCommandOptionType.Boolean,
        },
    ],
    callback: async (client, interaction) => {
        await interaction.deferReply();

        const isAllTime = interaction.options.getBoolean('all_time')

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
                    one += val[(isAllTime ? 0 : 1)][0]
                    two += val[(isAllTime ? 0 : 1)][1]
                    three += val[(isAllTime ? 0 : 1)][2]
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
                temp += `${res[k][1]}x:trophy:  ${res[k][2]}x:second_place:  ${res[k][3]}x:third_place:  \t\t<@${res[k][0]}>\n`
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

        if (embedList.length == 0){
		    await interaction.editReply('Nothing!');
            return;
        }

        await interaction.editReply({embeds: embedList})

        
    }
};
