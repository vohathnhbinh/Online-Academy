const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const validate = require('../middlewares/validation')
const authenticate = require('../middlewares/authentication')

router.get('/', authenticate.checkNotAuthenticated, (req, res) => {
    res.render('register')
})

router.post('/', authenticate.checkNotAuthenticated, validate.validateRegister(), async (req, res) => {
    const {username, email, password, fullname} = req.body

    if (!res.locals.fail) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10)

            const user = new User({
                username,
                fullname,
                email,
                password: hashedPassword,
                role: 0
            })
            await user.save()
            res.redirect('/login')
        } catch(err) {
            console.log(err)
            res.render('register', {
                username,
                fullname,
                email
            })
        }
    } else {
        res.render('register', {
            username,
            fullname,
            email
        })
    }
})

module.exports = router