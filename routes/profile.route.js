const express = require('express')
const router = express.Router()

router.get('/author', (req,res)=>{
    res.render('vwProfile/author');
})

module.exports = router