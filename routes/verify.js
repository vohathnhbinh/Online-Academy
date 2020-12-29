const express = require('express')
const authenticate = require('../middlewares/authentication')
const router = express.Router()
const User = require('../models/user')
const Passcode = require('../models/passcode')
const crypto = require('crypto')
const bcrypt = require('bcrypt')

router.get('/', authenticate.checkAuthenticated, authenticate.checkNotVerified, (req, res) => {
    res.render('verify', {
        user: req.user ? req.user._doc : null
    })
})

router.get('/send', authenticate.checkAuthenticated, authenticate.checkNotVerified, async (req, res) => {
    try {
        const passcode = await crypto.randomBytes(10).toString('hex')
        const hashedPasscode = await bcrypt.hash(passcode, 4)
        const pc = await Passcode.findOneAndUpdate(
            {
                username: req.user._doc.username
            },
            {
                $set: {
                    passcode: hashedPasscode
                }
            },
            {
                new: true,
                upsert: true,
                useFindAndModify: false
            }
        )
    } catch(err) {
        console.log(err)
    }
    const mailData = {
        from: 'me@me',
        to: 'you@you',
        subject: 'Account verification',
        text: 'passcode'
    }

    var transporter
    require('../config/nodemailer_config')(transporter)

    transporter.sendMail(mailData, function (err, info) {
        if(err)
            res.send(err)
        else
            res.send(info)
    })
})

module.exports = router