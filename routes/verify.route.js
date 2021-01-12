const express = require('express')
const authenticate = require('../middlewares/authentication')
const router = express.Router()
const User = require('../models/user')
const Passcode = require('../models/passcode')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')

router.get('/', authenticate.checkAuthenticated, authenticate.checkNotVerified, (req, res) => {
    res.render('verify', {
        user: req.user ? req.user._doc : null
    })
})

let transporter = null
nodemailer.createTestAccount((err, account) => {
    if(err) console.log(err)
    transporter = nodemailer.createTransport({
        name: 'example.com',
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: account.user,
            pass: account.pass
        }
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

        const mailData = {
            from: 'kgz21740@cuoly.com',
            to: 'uquoirwupzosbhmqff@twzhhq.com',
            subject: 'Account verification',
            text: 'passcode'
        }
    
        transporter.sendMail(mailData, function (err, info) {
            if(err)
                res.send(err)
            else
                res.send(info)
        })
    } catch(err) {
        console.log(err)
    }
    
})

module.exports = router