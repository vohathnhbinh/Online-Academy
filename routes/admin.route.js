const express = require('express')
const router = express.Router()
const Category = require('../models/category')
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

module.exports = router