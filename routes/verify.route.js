const express = require('express');
const authenticate = require('../middlewares/authentication');
const router = express.Router();
const VerifyCtrl = require('../controllers/verify.controller');

router.get(
  '/',
  authenticate.checkAuthenticated,
  authenticate.checkNotVerified,
  VerifyCtrl.getVerify
);

router.get(
  '/send',
  authenticate.checkAuthenticated,
  authenticate.checkNotVerified,
  VerifyCtrl.getSend
);

router.post(
  '/',
  authenticate.checkAuthenticated,
  authenticate.checkNotVerified,
  VerifyCtrl.postVerify
);

module.exports = router;
