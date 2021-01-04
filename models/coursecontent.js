const mongoose = require('mongoose')

const coursecontentSchema = new mongoose.Schema({
    course: {
        type: String,
        required: true,
        unique: true
    },
    content: [{
        chapter: Number,
        content: String
    }]
})

module.exports = mongoose.model('CourseContent', coursecontentSchema)