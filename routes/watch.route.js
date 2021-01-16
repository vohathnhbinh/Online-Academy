const express = require('express')
const router = express.Router()
const CourseContent = require('../models/coursecontent')
const utils = require('../config/utils')
const User = require('../models/user')
const Progress = require('../models/progress')
const Course = require('../models/course')

router.get('/', async (req, res) => {
    const courseId = req.query.courseId
    const chapter = req.query.chapter
    req.session.userId = req.user ? req.user._doc._id : null
    try {
        const coursecontent = await CourseContent.findOne({
            course: utils.convertId(courseId)
        }).populate('course').lean()

        const curVid = coursecontent.content[chapter - 1]
        let otherVids = coursecontent.content.splice(chapter - 1, 1)
        otherVids = coursecontent.content

        const student = await User.findOne({
            _id: req.user ? req.user._doc._id : null,
            courses: utils.convertId(courseId)
        })
        const teacher = await Course.findOne({
            teacher: req.user ? req.user._doc._id : null,
            _id: utils.convertId(courseId)
        })

        const progress = await Progress.findOne({
            student: req.user ? req.user._doc._id : null,
        }).lean()

        if (student || teacher || chapter == 1) {
            res.render('watch', {
                user: req.user ? req.user._doc : null,
                coursecontent,
                curVid,
                otherVids,
                progress: progress ? progress : 0
            })
        } else res.redirect(`/course/detail?courseId=${courseId}`)
        
    } catch(err) {
        console.log(err)
    }
})

router.post('/update-time', async(req, res) => {
    try {
        const {currentTime, title} = req.body
        const userId = req.session.userId
        const checkProgress = await Progress.findOne({
            student: utils.convertId(userId),
            'progress.video': title
        })
        if(!checkProgress) {
            
            const progress = await Progress.findOneAndUpdate(
                {
                    student: utils.convertId(userId)
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
        } else {
            await Progress.updateOne(
                {
                    student: utils.convertId(userId),
                    'progress.video': title
                },
                {
                    $set: {
                        'progress.$.time': currentTime
                    }
                }
            )
        }
        
        res.redirect('/')
    } catch(err) {
        console.log(err)
    }
})

module.exports = router