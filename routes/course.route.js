const express = require('express')
const router = express.Router()
const multer = require('multer')
const Category = require('../models/category')
const Course = require('../models/course')
const MoreCourse = require('../models/morecourse')
const utils = require('../config/utils')
const { findOneAndUpdate } = require('../models/category')

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

router.post('/add/image',(req,res)=>{
    console.log(courseInfo);
    const storage=multer.diskStorage({
        destination: function(req,file,cb){
            cb(null,'./public/image')
        },
        filename: function(req,res,cb){
            cb(null,file.originalname)
        }
    })
    const upload=multer({storage});
    storage.single('fuMain')(req,res,function(err){
        if(err){
            console.log(err)
            console.log(courseInfo)
        }else {
            courseInfo.smallPicture=file.originalname
            console.log(courseInfo)
        }
    })
})

router.get('/', (req,res)=>{
    res.render('vwCourse/profilecourse');
})

/*router.get('/mycourse/:id', (req,res)=>{
    res.render('vwCourse/');
}) */ // Chi tiet khoa hoc gianh cho giao vien (dung de chinh sua, them bai giang)

router.get('/profileauthor', (req,res)=>{
    res.render('vwProfile/author');
})

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
                }
            },
            {
                new: true,
                upsert: true,
                useFindAndModify: false
            }
        ).populate('course').lean()
        
        res.render('vwCourse/detail', {
            user: req.user ? req.user._doc : null,
            morecourse,
            empty: morecourse.length === 0,
            successful: true,
            isIn: true
        })
    } catch(err) {
        console.log(err)
    }
})

router.get('/byCat/:id', async (req, res) => {
    try {
        const categories = await Category.find({}).lean()
        const courses = await Course.find({
            category: utils.convertId(req.params.id)
        }).lean()

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

router.get('/detail/:id', async (req, res) => {
    try {
        const morecourse = await MoreCourse.findOneAndUpdate(
            {
                course: utils.convertId(req.params.id)
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
        ).populate('course').lean()
        
        let isIn = false
        const userId = req.user ? req.user._doc._id : null
        for (i = 0; i < morecourse.students.length; i++) {
            if (morecourse.students[i].student.equals(userId)) {
                isIn = true
                break
            }
        }

        res.render('vwCourse/detail', {
            user: req.user ? req.user._doc : null,
            morecourse,
            empty: morecourse.length === 0,
            isIn
        })
    } catch(err) {
        console.log(err)
    }
})

module.exports = router