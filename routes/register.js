const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const validate = require('../middlewares/validation')
const { body } = require('express-validator')

router.get('/', (req, res) => {
    res.render('register')
})

router.post('/', validate.validateRegister(), async (req, res) => {
    const {username, email, password} = req.body

    if (!res.locals.fail) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10)

            const user = new User({
                username,
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
                email
            })
        }
    } else {
        res.render('register', {
            username,
            email
        })
    }
})

module.exports = router