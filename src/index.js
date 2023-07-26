require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');
const eventHandler = require('./handlers/eventHandler');
const mongoose = require("mongoose")

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});




(async () => {
    mongoose.set('strictQuery', false)
    await mongoose.connect(process.env.MONGOURI)
    eventHandler(client);
})()

client.login(process.env.TOKEN);
