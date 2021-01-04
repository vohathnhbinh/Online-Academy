const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    title: { // Tieu de
        type: String,
        required: true,
        unique: true,
        index: true
    },
    category: { // Linh vuc
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    teacher: { // Giang vien
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    smallPicture: String,
    bigPicture: String,
    fee: {
        price: { // Hoc phi
            type: Number,
            required: true
        },
        sale: Number // Khuyen mai (%)
    },
    minDesc: {
        type: String,
        required: true
    },
    fullDesc: {
        type: String,
        required: true
    },
    more: { // Thong tin khac
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MoreCourse',
        required: true
    },
    content: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CourseContent',
        required: true
    }
})

module.exports = mongoose.model('Course', courseSchema)