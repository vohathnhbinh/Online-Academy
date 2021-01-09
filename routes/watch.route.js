const express = require('express')
const router = express.Router()
const CourseContent = require('../models/coursecontent')
const utils = require('../config/utils')
const User = require('../models/user')
const user = require('../models/user')

router.get('/', async (req, res) => {
    const courseId = req.query.courseId
    const chapter = req.query.chapter
    try {
        const coursecontent = await CourseContent.findOne({
            course: utils.convertId(courseId)
        }).populate('course').lean()

        const curVid = coursecontent.content[chapter - 1]
        const otherVids = coursecontent.content.splice(chapter - 1, 1)

        const student = await User.findOne({
            _id: req.user ? req.user._doc._id : null,
            courses: utils.convertId(courseId)
        })

        if (student || chapter == 1) {
            res.render('watch', {
                user: req.user ? req.user._doc : null,
                coursecontent,
                curVid,
                otherVids
            })
        } else res.redirect(`/course/detail?courseId=${courseId}`)
        
    } catch(err) {
        console.log(err)
    }
})

module.exports = router