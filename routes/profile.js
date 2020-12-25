const express = require('express')
const router = express.Router()
const authenticate = require('../middlewares/authentication')

router.get('/', authenticate.checkAuthenticated, (req, res) => {
    res.render('profile', {
        ...req.user._doc
    })
})

module.exports = router