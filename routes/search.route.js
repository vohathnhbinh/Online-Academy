const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authentication');
const SearchCtrl = require('../controllers/search.controller');

router.get('/', authenticate.checkNotLocked, SearchCtrl.getSearch);

router.get('/sort-fee', SearchCtrl.getSortFee);

router.get('/sort-rating', SearchCtrl.getSortRating);

module.exports = router;
