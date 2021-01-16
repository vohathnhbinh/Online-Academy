const express = require('express')
const router = express.Router()
const authenticate = require('../middlewares/authentication')

module.exports = passport => {
    router.get('/', authenticate.checkNotAuthenticated, authenticate.checkNotLocked, (req, res) => {
        res.render('login')
    })

    router.post('/', authenticate.checkNotAuthenticated, passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }), (req, res) => {
        res.redirect('/')
    })

    router.get('/logout', authenticate.checkAuthenticated, (req,res) => {
        req.logOut()
        req.session.destroy()
        res.redirect('/login')
    })

    return router
}