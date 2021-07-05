const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authentication');
const AdminCtrl = require('../controllers/admin.controller');

router.get('/', authenticate.checkAdmin, AdminCtrl.getAdmin);

router.get('/category', authenticate.checkAdmin, AdminCtrl.getCategory);

router.post('/category', AdminCtrl.postCategory);

router.get('/delete', AdminCtrl.deleteCategory);

router.get('/is-available', AdminCtrl.getAvailable);

router.post('/addcat', AdminCtrl.postAddCat);

router.get('/course', authenticate.checkAdmin, AdminCtrl.getCourse);

router.get('/disable', AdminCtrl.getDisable);

router.get('/enable', AdminCtrl.getEnable);

router.post('/filter', AdminCtrl.postFilter);

router.get('/sort-fee', AdminCtrl.getSortFee);

router.get('/sort-rating', AdminCtrl.getSortRating);

router.get('/user', authenticate.checkAdmin, AdminCtrl.getUser);

router.get('/maketeacher', AdminCtrl.getMakeTeacher);

router.get('/lock', AdminCtrl.getLock);

router.get('/unlock', AdminCtrl.getUnlock);

module.exports = router;
