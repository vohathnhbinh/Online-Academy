const mongoose = require('mongoose')

const morecourseSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
        unique: true
    },
    students: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        hasRated: Boolean,
        feedback: String
    }],
    rating: {
        rate: Number, // Danh gia
        amount: Number // So luong hoc vien danh gia
    },
    uploadDate: { // Ngay dang
        type: Date
    },
    viewAmount: Number, // So luong click xem chi tiet
    studentNum: Number, // So luong dang ky
    updatedDate: Date // Lan cap nhat cuoi
})

module.exports = mongoose.model('MoreCourse', morecourseSchema)