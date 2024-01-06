require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');
const eventHandler = require('./src/handlers/eventHandler');
const mongoose = require("mongoose")
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

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
