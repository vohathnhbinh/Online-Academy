const express = require('express')
const router = express.Router()
const Course = require('../models/course')
const Category = require('../models/category')

router.get('/', async (req, res) => {
    const result = req.query.q
    try {
        const categories = await Category.find({}).lean()
        const courses = await Course.find({
            $text: {
                $search: result
            }
        }).populate('teacher').populate('category').lean()
        req.session.courses = courses

        res.render('vwCourse/course', {
            user: req.user ? req.user._doc : null,
            categories,
            courses,
            empty: courses.length === 0
        })
    } catch (err) {
        console.log(err)
    }
})

router.get('/sort-fee', async (req, res) => {
    const courses = req.session.courses
    try {
        const categories = await Category.find({}).lean()
        courses.sort((a, b) => a.fee.price - b.fee.price)

        res.render('vwCourse/course', {
            user: req.user ? req.user._doc : null,
            categories,
            courses,
            empty: courses.length === 0
        })
    } catch (err) {
        console.log(err)
    }
})

module.exports = router