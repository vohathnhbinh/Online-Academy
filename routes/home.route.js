const express = require('express')
const router = express.Router()
const Category = require('../models/category')
const Course = require('../models/course')
const MoreCourse = require('../models/morecourse')
const User = require('../models/user')

router.get('/', async (req, res) => {
    try {
        const categories = await Category.find({}).lean()
        const morecourses = await MoreCourse.find({})
        .sort({
            studentNum: -1
        }).limit(3)
        .populate({
            path: 'course',
            model: 'Course',
            populate: [
                {
                    path: 'category',
                    model: 'Category'
                },
                {
                    path: 'teacher',
                    model: 'User'
                }
            ]
        }).lean()

        const viewestMorecourses = await MoreCourse.find({})
        .sort({
            viewAmount: -1
        }).limit(10)
        .populate({
            path: 'course',
            model: 'Course',
            populate: [
                {
                    path: 'category',
                    model: 'Category'
                },
                {
                    path: 'teacher',
                    model: 'User'
                }
            ]
        }).lean()

        const newestCourses = await Course.find({})
        .populate('teacher').populate('category')
        .sort({
            createdAt: -1,
            updatedOn: -1
        }).limit(10).lean()

        const hottestCategories = await Category.find({})
        .sort({
            studentNum: -1
        }).limit(3).lean()

        res.render('home', {
            user: req.user ? req.user._doc : null,
            categories,
            morecourses,
            viewestMorecourses,
            newestCourses,
            hottestCategories
        })
    } catch(err) {
        console.log(err)
    }
})

module.exports = router