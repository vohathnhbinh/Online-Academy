const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authentication');
const WatchCtrl = require('../controllers/watch.controller');

router.get('/', authenticate.checkNotLocked, WatchCtrl.getWatch);

router.post('/update-time', WatchCtrl.postUpdateTime);

module.exports = router;
