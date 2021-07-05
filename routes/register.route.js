const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const validate = require('../middlewares/validation');
const authenticate = require('../middlewares/authentication');
const RegCtrl = require('../controllers/register.controller');

router.get(
  '/',
  authenticate.checkNotAuthenticated,
  authenticate.checkNotLocked,
  RegCtrl.getRegister
);

router.post(
  '/',
  authenticate.checkNotAuthenticated,
  validate.validateRegister(),
  RegCtrl.postRegister
);

module.exports = router;
