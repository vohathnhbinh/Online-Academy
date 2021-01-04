const express = require('express')
const router = express.Router()

router.get('/add', (req,res)=>{
    res.render('vwCourse/add');
})

router.get('/', (req,res)=>{
    res.render('vwCourse/profilecourse');
})

router.get('/profileauthor', (req,res)=>{
    res.render('vwProfile/author');
})

module.exports = router