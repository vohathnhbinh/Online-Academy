const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authentication');
const CourseCtrl = require('../controllers/course.controller');

router.get('/test', CourseCtrl.getTest);

router.get(
  '/add',
  authenticate.checkAuthenticated,
  authenticate.checkNotLocked,
  CourseCtrl.getAdd
);

router.post('/add', upload.single('fuMain'), CourseCtrl.postAdd);

router.get('/has-joined', CourseCtrl.getHasJoin);

router.post('/join', CourseCtrl.postJoin);

router.get('/byCat', authenticate.checkNotLocked, CourseCtrl.getByCat);

router.get('/detail', authenticate.checkNotLocked, CourseCtrl.getDetail);

router.get('/favorite', CourseCtrl.getFavorite);

router.post('/rating', CourseCtrl.postRating);

module.exports = router;
