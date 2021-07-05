const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authentication');
const LoginCtrl = require('../controllers/login.controller');

module.exports = (passport) => {
  router.get(
    '/',
    authenticate.checkNotAuthenticated,
    authenticate.checkNotLocked,
    LoginCtrl.getLogin
  );

  router.post(
    '/',
    authenticate.checkNotAuthenticated,
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true,
    }),
    LoginCtrl.postLogin
  );

  router.get('/logout', authenticate.checkAuthenticated, LoginCtrl.getLogout);

  return router;
};
