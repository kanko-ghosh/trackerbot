const { ButtonBuilder, ActionRowBuilder } = require("@discordjs/builders");
const { ButtonStyle, ComponentType, EmbedBuilder } = require("discord.js");
const { CupReg } = require("../../Models/cup-registration");


async function f(client, nameofcup) {

    const guild = await client.guilds.fetch("708331848190787645")
    const channel = await guild.channels.fetch("793248712666513418")

    //#region BUTTON

    const AcceptButton = new ButtonBuilder()
        .setLabel("Accept")
        .setStyle(ButtonStyle.Success)
        .setCustomId("accept" + nameofcup)

    const RejectButton = new ButtonBuilder()
        .setLabel("Reject")
        .setStyle(ButtonStyle.Danger)
        .setCustomId("reject" + nameofcup)

    const TentativeButton = new ButtonBuilder()
        .setLabel("Tentative")
        .setStyle(ButtonStyle.Primary)
        .setCustomId("tent" + nameofcup)

    const buttonRow = new ActionRowBuilder().addComponents(AcceptButton, RejectButton, TentativeButton)

    //#endregion

    //#region String from list
    var cupreg = await CupReg.where({name: nameofcup}).findOne()
    if (cupreg && cupreg.date.getTime() - new Date().getTime() <= 0){
        await CupReg.deleteOne({ name: nameofcup})
        cupreg = null
    }
    const acceptedList = cupreg ? cupreg.accepted : []
    const rejectedList = cupreg ? cupreg.rejected : []
    const tentativeList = cupreg ? cupreg.tentative : []

    var accstr = "<->"
    var rejstr = "<->"
    var tentstr = "<->"

    if (acceptedList.length > 0) {
        accstr = ""
        for (i = 0; i < acceptedList.length; i++) {
            accstr += "<@" + acceptedList[i] + ">\n"
        }
    }
    if (rejectedList.length > 0) {
        rejstr = ""
        for (i = 0; i < rejectedList.length; i++) {
            rejstr += "<@" + rejectedList[i] + ">\n"
        }
    }
    if (tentativeList.length > 0) {
        tentstr = ""
        for (i = 0; i < tentativeList.length; i++) {
            tentstr += "<@" + tentativeList[i] + ">\n"
        }
    }

    //#endregion

    //#region Embed

    const embed = new EmbedBuilder()
        .setTitle(nameofcup)
        .setDescription("TEST")
        .addFields([
            {
                name: "Accepted",
                value: accstr,
                inline: true
            },
            {
                name: "Rejected",
                value: rejstr,
                inline: true
            },
            {
                name: "Tentative",
                value: tentstr,
                inline: true
            }
        ])

    //#endregion

    var reply;
    
    if (cupreg){
        try{
            message = await channel.messages.fetch(cupreg.messageid)
            reply = await message.edit({
                content: "<@&763485341663363123>",
                embeds: [embed],
                components: [buttonRow]
            })
        } catch {
            reply = await channel.send({
                content: "<@&763485341663363123>",
                embeds: [embed],
                components: [buttonRow]
            })
            await CupReg.findOneAndUpdate({
                name:nameofcup
            }, {
                messageid: reply.id
            })
        }
    } else {
        reply = await channel.send({
            content: "<@&763485341663363123>",
            embeds: [embed],
            components: [buttonRow]
        })
        d2 = new Date()
        d2.setHours(d2.getHours() + 2);
        cupreg = new CupReg({
            messageid: reply.id,
            name: nameofcup,
            date: d2
        })
        await cupreg.save()
    }


    const collector = reply.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: cupreg ? cupreg.date.getTime() - new Date().getTime() : 1000 * 60 * 120,
        errors: ['time']
    })

    collector.on('collect', (interaction) => {
        const uid = interaction.user.id
        //remove from list if any
        const acceptindex = acceptedList.indexOf(uid);
        var cas = -1
        if (acceptindex > -1) {
            acceptedList.splice(acceptindex, 1);
            cas = 0
        }
        const rejectindex = rejectedList.indexOf(uid);
        if (rejectindex > -1) {
            rejectedList.splice(rejectindex, 1);
            cas = 1
        }
        const tentindex = tentativeList.indexOf(uid);
        if (tentindex > -1) {
            tentativeList.splice(tentindex, 1);
            cas = 2
        }


        if (interaction.customId === "accept" + nameofcup && cas != 0) 
            acceptedList.push(uid)
        else if (interaction.customId === "reject" + nameofcup && cas != 1) 
            rejectedList.push(uid)
        else if (interaction.customId === "tent" + nameofcup && cas != 2) 
            tentativeList.push(uid)


        CupReg.findOneAndUpdate({
            name:nameofcup
        }, {
            accepted:acceptedList, 
            rejected:rejectedList, 
            tentative:tentativeList
        })


        var accstr = "<->"
        var rejstr = "<->"
        var tentstr = "<->"

        if (acceptedList.length > 0) {
            accstr = ""
            for (i = 0; i < acceptedList.length; i++) {
                accstr += "<@" + acceptedList[i] + ">\n"
            }
        }
        if (rejectedList.length > 0) {
            rejstr = ""
            for (i = 0; i < rejectedList.length; i++) {
                rejstr += "<@" + rejectedList[i] + ">\n"
            }
        }
        if (tentativeList.length > 0) {
            tentstr = ""
            for (i = 0; i < tentativeList.length; i++) {
                tentstr += "<@" + tentativeList[i] + ">\n"
            }
        }

        const embed = new EmbedBuilder()
            .setTitle(nameofcup)
            .setDescription("TEST")
            .addFields([
                {
                    name: "Accepted",
                    value: accstr,
                    inline: true
                },
                {
                    name: "Rejected",
                    value: rejstr,
                    inline: true
                },
                {
                    name: "Tentative",
                    value: tentstr,
                    inline: true
                }
            ])
        reply.edit({
            embeds: [embed],
        })
        interaction.reply({
            content: "DONE",
            ephemeral: true
        })
        return
    })

    collector.on('end', () => {
        AcceptButton.setDisabled(true)
        RejectButton.setDisabled(true)
        TentativeButton.setDisabled(true)

        reply.edit({
            components: [buttonRow]
        })
        .then(() => {})
        .catch((err)=> {})

        CupReg.deleteOne({ name: nameofcup})
        .then(() => {})
        .catch((err)=> {})

        return
    })

    return
}

module.exports = async (client) => {
    console.log("LOL")
    //await f(client, "TEST")
    while (true) {
        console.log("waiting")
        d = new Date()
        const weekday = d.getDay();
        const hour = d.getHours();
        console.log(hour)
        if (hour === 22) {
            await f(client, "Silver Cup US");
        }
        if (hour === 0) {
            await f(client, "America Cup");
        }
        if (hour === 6) {
            await f(client, "Asia Cup Singapore");
        }
        if (hour === 8) {
            await f(client, "Silver Cup Singapore")
        }
        if (hour === 10) {
            await f(client, "Silver Cup EU")
        }
        if (hour === 12) {
            await f(client, "Silver Cup India")
        }
        if (hour === 14) {
            await f(client, "Silver Cup EU 2")
        }
        if (hour === 18) {
            await f(client, "GOLD")
        }
        if (hour === 12 && weekday === 0) {
            await f(client, "Platinum")
        }

        await new Promise(resolve => setTimeout(resolve, 1000 * 60 * 10)); // Wait for 15 minutes
    }
};
