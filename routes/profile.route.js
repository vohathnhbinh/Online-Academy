const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authentication');
const ProfileCtrl = require('../controllers/profile.controller');

router.get('/', authenticate.checkAuthenticated, ProfileCtrl.getProfile);

router.get(
  '/favorite',
  authenticate.checkAuthenticated,
  ProfileCtrl.getFavorite
);

router.get('/delete', ProfileCtrl.deleteFavorite);

router.get('/is-available', ProfileCtrl.getAvailable);

router.get('/course-available', ProfileCtrl.getCourseAvailable);

router.get('/is-found', ProfileCtrl.getFound);

router.post('/', ProfileCtrl.postProfile);

router.get('/mycourse', ProfileCtrl.getMyCourse);

router.get('/edit', ProfileCtrl.getEdit);

router.post('/edit', ProfileCtrl.upload.single('fuMain'), ProfileCtrl.postEdit);

router.get('/markcomplete', ProfileCtrl.getMarkComplete);

router.get('/markincomplete', ProfileCtrl.getMarkIncomplete);

module.exports = router;
