const mongoose = require('mongoose')

const coursecontentSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
        unique: true
    },
    content: [{
        chapter: Number,
        video: String
    }]
})

module.exports = mongoose.model('CourseContent', coursecontentSchema)