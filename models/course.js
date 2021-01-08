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
    fee: {
        price: { // Hoc phi
            type: Number,
            required: true
        },
        sale: Number // Khuyen mai (%)
    },
    smallPicture: String,
    minDesc: {
        type: String,
        required: true
    },
    fullDesc: {
        type: String,
        required: true
    },
    rate: Number,
    createdOn: {type: Date, default: new Date()},
    updatedOn: Date
})

courseSchema.index(
    {
        title: 'text',
        minDesc: 'text'
    }
)
module.exports = mongoose.model('Course', courseSchema)