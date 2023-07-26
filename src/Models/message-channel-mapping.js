const mongoose = require("mongoose")

const channel_message = new mongoose.Schema({
    channelid : {
        type: String,
        required: true
    }, 
    messageid : {
        type: String,
    }, 
    messagetype : {
        type: String,
        required: true
    }, 
    

})

exports.ChannelMessage = mongoose.model("channel_messages", channel_message)