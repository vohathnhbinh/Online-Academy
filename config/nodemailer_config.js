const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
    clientId: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET,
    refreshToken: process.env.REFRESHTOKEN,
  },
});

const checkMailConnection = (Transporter) => {
  Transporter.verify((err, success) => {
    if (err) console.log(err);
    if (success) console.log('Server is ready to handle mail');
  });
};

module.exports = {
  transporter,
  checkMailConnection,
};
