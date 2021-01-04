const mongoose = require('mongoose')

const morecourseSchema = new mongoose.Schema({
    course: {
        type: String,
        required: true,
        unique: true
    },
    student: [{
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
        type: Date,
        required: true
    },
    viewAmount: Number, // So luong click xem chi tiet
    updatedDate: Date // Lan cap nhat cuoi
})

module.exports = mongoose.model('MoreCourse', morecourseSchema)