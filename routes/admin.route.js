const express = require('express')
const router = express.Router()
const Category = require('../models/category')
const Course = require('../models/course')
const User = require('../models/user')
const utils = require('../config/utils')

router.get('/', (req, res) => {
    res.render('vwAdmin/admin', {
        user: req.user ? req.user._doc : null
    })
})

router.get('/category', async(req, res) => {
    try {
        const categories = await Category.find({}).lean()

        const catTYPE = categories.map(item => item.type)
        .filter((value, index, self) => self.indexOf(value) === index)

        res.render('vwAdmin/category', {
            user: req.user ? req.user._doc : null,
            cat: categories,
            catTYPE
        })
    } catch(err) {
        console.log(err)
    }
})

router.post('/category', async(req, res) => {
    try {
        const id = req.query.id

        const catname = req.body.catname
        const updatedCatName = req.body[catname]

        const cattype = req.body.cattype
        const updatedCatType = req.body[cattype]

        const updatedCat = {
            name: updatedCatName,
            type: updatedCatType
        }
        for(let i in updatedCat){
            if(!updatedCat[i]){
                delete updatedCat[i]
            }
        }

        const category = await Category.findOneAndUpdate(
            {
                _id: utils.convertId(id)
            }, updatedCat,
            {
                new: true
            }
        )
        res.redirect('category')
    } catch(err) {
        console.log(err)
    }
})

router.get('/delete', async(req, res) => {
    try {
        const id = req.query.id
        const category = await Category.findOne({
            _id: utils.convertId(id)
        })

        if(category.studentNum > 0) {
            const categories = await Category.find({}).lean()

            const catTYPE = categories.map(item => item.type)
            .filter((value, index, self) => self.indexOf(value) === index)

            res.render('vwAdmin/category', {
                user: req.user ? req.user._doc : null,
                cat: categories,
                catTYPE,
                error: true
            })
        } else {
            await Category.deleteOne({
                _id: utils.convertId(id)
            })
            res.redirect('category')
        }
    } catch(err) {
        console.log(err)
    }
})

router.get('/is-available', async(req, res) => {
    const catname = req.query.catname
    try {
        const category = await Category.findOne({
            name: catname
        })

        if(category) return res.json(false)
        res.json(true)
    } catch {
        console.log(err)
    }
})

router.post('/addcat', async(req, res) => {
    const {catName, catType} = req.body
    try {
        const category = new Category({
            name: catName,
            type: catType
        })

        await category.save()
        res.redirect('category')
    } catch(err) {
        console.log(err)
    }
})

router.get('/course', async(req, res) => {
    try {
        const courses = await Course.find({}).
        populate('teacher').populate('category').lean()
        req.session.courses = courses

        const categories = await Category.find({}).lean()
        const teachers = await User.find({
            role: 1
        }).lean()

        res.render('vwAdmin/xcourse', {
            user: req.user ? req.user._doc : null,
            courses,
            cat: categories,
            teachers
        })
    } catch(err) {
        console.log(err)
    }
})

router.get('/disable', async(req, res) => {
    const courseId = req.query.courseId
    try {
        await Course.updateOne(
            {
                _id: utils.convertId(courseId)
            },
            {
                disabled: true
            }
        )
        res.redirect('course')
    } catch(err) {
        console.log(err)
    }
})

router.get('/enable', async(req, res) => {
    const courseId = req.query.courseId
    try {
        await Course.updateOne(
            {
                _id: utils.convertId(courseId)
            },
            {
                disabled: false
            }
        )
        res.redirect('course')
    } catch(err) {
        console.log(err)
    }
})

router.post('/filter', async(req, res) => {
    try {
        const {category, teacher} = req.body

        let courses
        if(category && teacher) {
            courses = await Course.find({
                category: utils.convertId(category),
                teacher: utils.convertId(teacher)
            }).lean()
        } else if (category) {
            courses = await Course.find({
                category: utils.convertId(category)
            }).lean()
        } else if (teacher) {
            courses = await Course.find({
                teacher: utils.convertId(teacher)
            }).lean()
        }
        req.session.courses = courses

        const categories = await Category.find({}).lean()
        const teachers = await User.find({
            role: 1
        }).lean()

        res.render('vwAdmin/xcourse', {
            user: req.user ? req.user._doc : null,
            courses,
            cat: categories,
            teachers
        })
    } catch(err) {
        console.log(err)
    }
})

router.get('/sort-fee', async (req, res) => {
    const courses = req.session.courses
    try {
        const categories = await Category.find({}).lean()
        courses.sort((a, b) => a.fee.price - b.fee.price)

        const teachers = await User.find({
            role: 1
        }).lean()

        res.render('vwAdmin/xcourse', {
            user: req.user ? req.user._doc : null,
            cat: categories,
            courses,
            teachers,
            empty: courses.length === 0
        })
    } catch (err) {
        console.log(err)
    }
})

router.get('/sort-rating', async (req, res) => {
    const courses = req.session.courses
    try {
        const categories = await Category.find({}).lean()
        courses.sort((a, b) => b.rate - a.rate)

        const teachers = await User.find({
            role: 1
        }).lean()

        res.render('vwAdmin/xcourse', {
            user: req.user ? req.user._doc : null,
            cat: categories,
            courses,
            teachers,
            empty: courses.length === 0
        })
    } catch (err) {
        console.log(err)
    }
})

module.exports = router