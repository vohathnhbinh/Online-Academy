const LocalStratedy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const User = require('../models/user')

module.exports = passport => {
    const authenticateUser = async (username, password, done) => {
        try {
            const user = await User.findOne({
                username: username
            })
            if (!user) return done(null, false, {message: 'Incorrect username'})
            else {
                const result = await bcrypt.compare(password, user.password)
                if (result) return done(null, user)
                else return done(null, false, {message: 'Incorrect password'})
            }
        } catch(err) {
            console.log(err)
        }
    }

    passport.use(new LocalStratedy(authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser(async (id, done) => {
        return done(null, await User.findById(id))
    })
}