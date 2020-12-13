const express = require('express')
const router = express.Router()
const ensureAuthenticated = require('../middlewares/authenticated')

router.get('/', ensureAuthenticated, (req, res) => {
    res.render('home')
})

module.exports = router