const mongoose = require('mongoose')

const coursecontentSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true 
    },
    content: [{
        chapter: Number,
        content: String
    }]
})

module.exports = mongoose.model('CourseContent', coursecontentSchema)