const express = require('express')
const router = express.Router()
const multer = require('multer')
const Category = require('../models/category')
const Course = require('../models/course')
const MoreCourse = require('../models/morecourse')
const User = require('../models/user')
const utils = require('../config/utils')

router.get('/test', async (req, res) => {
    try {
        let category = await Category.findOne({
            name: "Python"
        })
        let course = new Course({
            title: "Python Web Development 1",
            category: category._id,
            teacher: req.user._doc._id,
            fee: {
                price: 1000,
                sale: 10
            },
            minDesc: "Hey",
            fullDesc: "Hello"
        })

        await course.save()
        res.redirect('/')
    } catch(err) {
        console.log(err)
    }
})

router.get('/add', async (req,res) => {
    try {
        const categories = await Category.find({}).lean()
        res.render('vwCourse/add', {
            user: req.user ? req.user._doc : null,
            categories
        })
    } catch(err) {
        console.log(err)
    }
})

router.get('/add/image',(req,res)=>{
    res.render('vwCourse/addimage')
})

router.post('/add', async function(req,res){
    const {NameCourse, CategoryCourse, MinDesc, FullDesc, Fee}=req.body;
    try {
        let course = new Course({
            title: NameCourse,
            category: utils.convertId(CategoryCourse),
            teacher: req.user._doc._id,
            fee: {
                price: Fee,
                sale: 10
            },
            // smallPicture: imgCourse,
            minDesc: MinDesc,
            fullDesc: FullDesc
        })
        
        res.render('vwCourse/addimage',{
            courseInfo: course,
        })
        //await course.save()
        //res.redirect('/')
    } catch(err) {
        console.log(err)
    }    
});

router.get('/has-joined', async (req, res) => {
    const courseId = req.query.courseId
    try {
        const morecourse = await MoreCourse.findOne({
            course: utils.convertId(courseId),
        }).elemMatch('students', {student: req.user._doc._id})
        if(morecourse) return res.json(true)
        res.json(false)
    } catch(err) {
        console.log(err)
    }
})

router.post('/join', async (req, res) => {
    try {
        const morecourse = await MoreCourse.findOneAndUpdate(
            {
                course: utils.convertId(req.body.id)
            },
            {
                $push: {
                    students: {
                        student: req.user._doc._id
                    }
                },
                $inc: {
                    studentNum: 1
                }
            },
            {
                new: true,
                useFindAndModify: false
            }
        ).populate({
            path: 'course',
            model: Course,
            populate: {
                path: 'teacher',
                model: User
            }
        }).populate('students.student').lean()
        
        res.redirect(`detail?courseId=${req.body.id}`)
    } catch(err) {
        console.log(err)
    }
})

router.get('/byCat', async (req, res) => {
    try {
        const categories = await Category.find({}).lean()
        const categoryId = req.query.categoryId
        const courses = await Course.find({
            category: utils.convertId(categoryId)
        }).populate('teacher').populate('category').lean()
        req.session.courses = courses

        res.render('vwCourse/course', {
            user: req.user ? req.user._doc : null,
            categories,
            courses,
            empty: courses.length === 0
        })
    } catch(err) {
        console.log(err)
    }
})

router.get('/detail', async (req, res) => {
    try {
        const courseId = req.query.courseId
        const morecourse = await MoreCourse.findOneAndUpdate(
            {
                course: utils.convertId(courseId)
            },
            {
                $inc: {
                    viewAmount: 1
                }
            },
            {
                new: true,
                upsert: true,
                useFindAndModify: false
            }
        ).populate({
            path: 'course',
            model: Course,
            populate: {
                path: 'teacher',
                model: User
            }
        }).populate('students.student').lean()

        let isIn = false
        const userId = req.user ? req.user._doc._id : null
        const studentNum = morecourse.students ? morecourse.students.length : 0
        for (i = 0; i < studentNum; i++) {
            if (morecourse.students[i].student._id.equals(userId)) {
                isIn = true
                break
            }
        }

        const altMorecourses = await MoreCourse.find({
            course: {$ne: utils.convertId(courseId)}
        }).populate({
            path: 'course',
            model: 'Course',
            populate: {
                path: 'category',
                model: Category,
                match: {
                    _id: morecourse.course.category
                }
            },
            populate: {
                path: 'teacher',
                model: User
            }
        }).sort({
            studentNum: -1 // Descending
        }).limit(5).lean()
        console.log(altMorecourses)
        res.render('vwCourse/detail', {
            user: req.user ? req.user._doc : null,
            morecourse,
            isIn,
            altMorecourses
        })
    } catch(err) {
        console.log(err)
    }
})

router.post('/feedback', async (req, res) => {
    try {
        console.log(req.body.feedback)
        const morecourse = await MoreCourse.findOneAndUpdate(
            {
                course: utils.convertId(req.body.id),
                'students.student': req.user._doc._id
            },
            {
                $set: {
                    'students.$.feedback': req.body.feedback
                }
            },
            {
                new: true,
                useFindAndModify: false
            }
        )
        res.redirect(`detail?courseId=${req.body.id}`)
    } catch(err) {
        console.log(err)
    }
})

module.exports = router