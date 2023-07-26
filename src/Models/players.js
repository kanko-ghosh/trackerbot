const mongoose = require("mongoose")

const player = new mongoose.Schema({
    id : {
        type: String,
        required: true
    }, 
    isArchived : {
        type: Boolean,
        default: false
    },
    asia : {
        type: Array,
        default: [[0, 0, 0], [0, 0, 0]]
    }, 
    silver_singapore : {
        type: Array,
        default: [[0, 0, 0], [0, 0, 0]]
    },
    silver_eu : {
        type: Array,
        default: [[0, 0, 0], [0, 0, 0]]
    },
    silver_india : {
        type: Array,
        default: [[0, 0, 0], [0, 0, 0]]
    }, 
    silver_eu_2: {
        type: Array,
        default: [[0, 0, 0], [0, 0, 0]]
    }, 
    gold : {
        type: Array,
        default: [[0, 0, 0], [0, 0, 0]]
    }, 
    silver_us : {
        type: Array,
        default: [[0, 0, 0], [0, 0, 0]]
    }, 
    america : {
        type: Array,
        default: [[0, 0, 0], [0, 0, 0]]
    }, 
    global : {
        type: Array,
        default: [[0, 0, 0], [0, 0, 0]]
    }, 
    platinum : {
        type: Array,
        default: [[0, 0, 0], [0, 0, 0]]
    }, 
    diamond : {
        type: Array,
        default: [[0, 0, 0], [0, 0, 0]]
    }, 

})

exports.Player = mongoose.model("players", player)