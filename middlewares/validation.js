const {check, validationResult} = require('express-validator')
const User = require('../models/user')

const validateRegister = () => {
    return [
        check('username', 'Username must have at least 6 characters').isLength({min: 6}),
        check('password', 'Password must have at least 6 characters').isLength({min: 6}),
        check('repassword', 'Password does not match').custom((value, {req}) => {
            if (value !== req.body.password) return false
            return true
        }),
        check('username', 'Username is unavailable').custom(async value => {
            let existUser = await User.findOne({
                username: value
            })

            if (existUser) return Promise.reject()
            return true
        }),
        check('email', 'Email is already in use').custom(async value => {
            let existEmail = await User.findOne({
                email: value
            })

            if (existEmail) return Promise.reject()
            return true
        }),
        
        (req, res, next) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                res.locals.errors = errors.mapped()
                res.locals.fail = true
            } else res.locals.fail = false
    
            next()
        }
    ]
}


const validate = {
    validateRegister
}

module.exports = validate