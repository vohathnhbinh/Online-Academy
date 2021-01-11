const mongoose = require('mongoose')

const progressSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    progress: [
        {
            video: String,
            time: Number
        }
    ],
})

module.exports = mongoose.model('Progress', progressSchema)