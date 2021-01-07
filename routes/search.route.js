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

        const page = (req.query.page <= (courses.length-1)) || req.query.page ? req.query.page : 1 
        const perPage = 2
        const altCourses = await Course.find({
            $text: {
                $search: result
            }
        }).populate('teacher').populate('category')
        .limit(perPage).skip((page - 1) * perPage)
        .sort({
            createdAt: -1,
            updatedAt: -1
        }).lean()

        const pages = []
        let paginationNum = 0
        if (((courses.length-1) / perPage) == parseInt((courses.length-1) / perPage)) {
            paginationNum = (courses.length-1) / perPage
        } else paginationNum = parseInt((courses.length-1) / perPage) + 1
        for(i = 1; i <= paginationNum; i++) {
            pages.push(i)
        }

        res.render('vwCourse/course', {
            user: req.user ? req.user._doc : null,
            categories,
            courses: altCourses,
            searchQ: result,
            pages,
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