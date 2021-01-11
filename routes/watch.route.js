const express = require('express')
const router = express.Router()
const CourseContent = require('../models/coursecontent')
const utils = require('../config/utils')
const User = require('../models/user')
const Progress = require('../models/progress')

router.get('/', async (req, res) => {
    const courseId = req.query.courseId
    const chapter = req.query.chapter
    try {
        const coursecontent = await CourseContent.findOne({
            course: utils.convertId(courseId)
        }).populate('course').lean()

        const curVid = coursecontent.content[chapter - 1]
        const otherVids = coursecontent.content.splice(chapter, 1)

        const student = await User.findOne({
            _id: req.user ? req.user._doc._id : null,
            courses: utils.convertId(courseId)
        })

        const progress = await Progress.findOne({
            student: req.user ? req.user._doc._id : null,
            'progress.title': curVid.title
        })

        if (student || chapter == 1) {
            res.render('watch', {
                user: req.user ? req.user._doc : null,
                coursecontent,
                curVid,
                otherVids,
                progressTime: progress ? progress.progress.time : 0
            })
        } else res.redirect(`/course/detail?courseId=${courseId}`)
        
    } catch(err) {
        console.log(err)
    }
})

router.post('/update-time', async(req, res) => {
    try {
        const currentTime = req.query.currentTime
        const title = req.query.title
        console.log(currentTime)
        const progress = await Progress.findOneAndUpdate(
            {
                student: req.user ? req.user._doc._id : null
            },
            {
                $push: {
                    progress: {
                        video: title,
                        time: currentTime
                    }
                }
            },
            {
                new: true,
                upsert: true,
                useFindAndModify: false
            }
        )
        res.json(true)
    } catch(err) {
        console.log(err)
    }
    
})

module.exports = router