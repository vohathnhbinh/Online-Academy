const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

router.get('/', (req, res) => {
    res.render('register')
})

router.post('/', async (req, res) => {
    const {username, email, password} = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })
        await newUser.save()
        res.send('Register complete')
    } catch(err) {
        res.send('Register fail')
    }
})

module.exports = router