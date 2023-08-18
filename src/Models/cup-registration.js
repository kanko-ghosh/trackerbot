const mongoose = require("mongoose")

const cup_reg = new mongoose.Schema({
    messageid : {
        type: String,
    }, 
    name: {
        type: String,
        required: true
    }, 
    accepted: {
        type: [String],
        default: []
    },
    rejected: {
        type: [String],
        default: []
    },
    tentative: {
        type: [String],
        default: []
    },
    date: {
        type: Date
    }
})

exports.CupReg = mongoose.model("cup_regs", cup_reg)