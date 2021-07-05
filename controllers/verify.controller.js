const Passcode = require('../models/passcode');
const User = require('../models/user');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

module.exports = {
  getVerify: (req, res) => {
    res.render('verify', {
      user: req.user ? req.user._doc : null,
    });
  },

  getSend: async (req, res, next) => {
    try {
      const passcode = await crypto.randomBytes(10).toString('hex');
      const hashedPasscode = await bcrypt.hash(passcode, 4);
      const pc = await Passcode.findOneAndUpdate(
        {
          username: req.user._doc.username,
        },
        {
          $set: {
            passcode: hashedPasscode,
          },
        },
        {
          new: true,
          upsert: true,
          useFindAndModify: false,
        }
      );

      const mailContent =
        `<p>Welcome ${req.user.fullname}</p>` +
        '<p>Please enter this passcode to verify your account</p>' +
        `<p>${passcode}</p>`;

      const mailOptions = {
        from: 'hometeacher2077@gmail.com',
        to: req.user.email,
        subject: 'Account verification - Home Teacher',
        html: mailContent,
      };

      const result = await transporter.sendMail(mailOptions);
      res.redirect('/');
    } catch (err) {
      next(err);
    }
  },

  postVerify: async (req, res, next) => {
    try {
      const { passcode } = req.body;
      const pc = await Passcode.findOne({
        username: req.user._doc.username,
      });

      const result = bcrypt.compare(passcode, pc.passcode);

      if (result) {
        const updatedUser = {
          activated: true,
        };
        await User.findByIdAndUpdate(req.user.user_id, updatedUser);
        res.redirect('../');
      } else {
        res.redirect('/');
      }
    } catch (err) {
      next(err);
    }
  },
};
