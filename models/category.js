const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name: { //Nodejs, React Native, Game, ...
        type: String,
        required: true,
        unique: true,
        index: true
    },
    type: { // Lap trinh web, Lap trinh thiet bi di dong
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Category', categorySchema)