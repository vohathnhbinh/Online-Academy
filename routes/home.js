const express = require('express')
const router = express.Router()
const authenticate = require('../middlewares/authentication')

router.get('/', authenticate.checkAuthenticated, (req, res) => {
    res.render('home', {
        user: req.session.user
    })
})

module.exports = router