const mongoose = require("mongoose")

const season = new mongoose.Schema({
    season : {
        type: Number,
        required: true
    }, 
})

exports.Season = mongoose.model("seasons", season)