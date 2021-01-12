const mongoose = require('mongoose')

const morecourseSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
        unique: true
    },
    students: [{
        _id:false,
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        rate: Number,
        feedback: String
    }],
    viewAmount: Number, // So luong click xem chi tiet
    studentNum: Number, // So luong dang ky
})

module.exports = mongoose.model('MoreCourse', morecourseSchema)