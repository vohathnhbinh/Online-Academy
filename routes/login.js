const express = require('express')
const router = express.Router()

module.exports = passport => {
    router.get('/', (req, res) => {
        res.render('login')
    })

    router.post('/', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }), (req, res) => {
        console.log(req.body)
        res.redirect('/')
    })

    router.get('/logout', (req,res) => {
        req.logout()
        res.redirect('/')
    })

    return router
}