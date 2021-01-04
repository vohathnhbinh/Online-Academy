const express = require('express')
const router = express.Router()
const Category = require('../models/category')
const Course = require('../models/course')
const mongoose = require('mongoose')

router.get('/test', async (req, res) => {
    try {
        const category = await Category.findOne({
            name: "Python"
        })
        let course = new Course({
            title: "Python Web Development",
            category: category._id
        })
    } catch(err) {
        console.log(err)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const categories = await Category.find({}).lean()
        const courses = await Course.find({
            category: mongoose.ObjectId(req.params)
        })
        res.render('course', {
            user: req.user ? req.user._doc : null,
            categories,
            courses,
            empty: courses.length === 0
        })
    } catch(err) {
        console.log(err)
    }
})
module.exports = router