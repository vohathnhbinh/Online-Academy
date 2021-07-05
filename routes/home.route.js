const express = require('express');
const router = express.Router();
const HomeCtrl = require('../controllers/home.controller');

router.get('/', HomeCtrl.getHome);

module.exports = router;
