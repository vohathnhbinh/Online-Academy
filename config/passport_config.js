const LocalStratedy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const User = require('../models/user')

module.exports = passport => {
    const authenticateUser = async (req, username, password, done) => {
        const user = await User.findOne({
            username: username
        })
        if (!user) return done(null, false, {message: 'Incorrect username'})
        else {
            await bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    req.session.user = user
                    return done(null, user)
                }
                else return done(null, false, {message: 'Incorrect password'})
            })
        }
        
    }

    const getUserById = async id => {
        return await User.findById(id)
    }

    passport.use(new LocalStratedy({passReqToCallback: true}, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
    })
}