const nodemailer = require('nodemailer')

const mailInit = (transporter) => {
    nodemailer.createTestAccount((err, account) => {
        if(err) console.log(err)
        transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: account.user,
                pass: account.pass
            }
        })
    })
}
module.exports = mailInit
