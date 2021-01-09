const express = require('express')
const router = express.Router()
const authenticate = require('../middlewares/authentication')
const User = require('../models/user')
const Category = require('../models/category')
const Course = require('../models/course')
const MoreCourse = require('../models/morecourse')
const utils = require('../config/utils')
const bcrypt = require('bcrypt')
const category = require('../models/category')

router.get('/', authenticate.checkAuthenticated, (req, res) => {
    res.render('vwProfile/profile', {
        user: req.user ? req.user._doc : null,
        favorite: true
    })
})

router.get('/favorite', async (req, res) => {
    try {
        const student = await User.findOne({
            _id: req.user._doc._id
        }).populate({
            path: 'watchlist',
            model: 'Course',
            populate: [
                {
                    path: 'teacher',
                    model: 'User'
                },
                {
                    path: 'category',
                    model: 'Category'
                }
            ]
        }).lean()

        res.render('vwCourse/course', {
            user: req.user ? req.user._doc : null,
            courses: student.watchlist
        })
    } catch(err) {

    }
})

router.get('/is-available', async (req, res) => {
    const username = req.query.username
    const email = req.query.email
    try {
        const user = await User.findOne({$or: [
            {username: username},
            {email: email}
        ]})

        if(user) return res.json(false)
        res.json(true)
    } catch(err) {
        console.log(err)
    }
})

router.get('/is-found', async (req, res) => {
    const password = req.query.password
    try {
        const user = await User.findOne({
            username: req.user._doc.username
        })
        const result = await bcrypt.compare(password, user.password)

        if(result) return res.json(true)
        res.json(false)
    } catch(err) {
        console.log(err)
    }
})

router.post('/', async (req, res) => {
    let updatedValue = {fullname, username, email, n_password} = req.body
    
    for(let i in updatedValue)
        if(!updatedValue[i])
            delete updatedValue[i]

    let isSuccessful = false
    try {
        if(n_password) {
            const hashedPassword = await bcrypt.hash(n_password, 10)
            updatedValue.password = hashedPassword
            isSuccessful = true
        }
        const updatedUser = await User.findOneAndUpdate(
            {
                username: req.user._doc.username
            }, updatedValue,
            {
                new: true,
                useFindAndModify: false
            }
        )
        res.render('profile', {
            isSuccessful
        })
    } catch(err) {
        console.log(err)
    }
})

router.get('/mycourse', async (req, res) => {
    const courses = await Course.find(
        {
            teacher: req.user._doc._id
        }
    ).populate('teacher').populate('category').lean()
    
    res.render('vwCourse/course',{
        user: req.user ? req.user._doc : null,
        courses    
    })
})

router.get('/edit', async (req,res)=>{
    const courseId= req.query.courseId
    const course = await Course.findOne(
        {
            _id: utils.convertId(courseId)
        }
    ).populate('teacher').populate('category').lean()
    console.log(course)
    res.render('vwCourse/edit',{
        user: req.user ? req.user._doc : null,
        course   
    })
})

module.exports = router