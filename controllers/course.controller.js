const multer = require('multer');
const Category = require('../models/category');
const Course = require('../models/course');
const MoreCourse = require('../models/morecourse');
const User = require('../models/user');
const CourseContent = require('../models/coursecontent');
const utils = require('../config/utils');
const fs = require('fs');

let filename;
let dir;
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    dir = './public/tmp';
    await fs.promises.mkdir(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    filename = Date.now() + file.originalname;
    cb(null, filename);
  },
});
const upload = multer({ storage });

module.exports = {
  getTest: async (res, req, next) => {
    try {
      let category = await Category.findOne({
        name: 'Python',
      });
      let course = new Course({
        title: 'Python Web Development 1',
        category: category._id,
        teacher: req.user._doc._id,
        fee: {
          price: 1000,
          sale: 10,
        },
        minDesc: 'Hey',
        fullDesc: 'Hello',
      });

      await course.save();
      res.redirect('/');
    } catch (err) {
      next(err);
    }
  },

  getAdd: async (req, res, next) => {
    try {
      const categories = await Category.find({}).lean();
      res.render('vwCourse/add', {
        user: req.user ? req.user._doc : null,
        categories,
      });
    } catch (err) {
      next(err);
    }
  },

  postAdd: async (req, res, next) => {
    const { fuMain, NameCourse, CategoryCourse, MinDesc, FullDesc, Fee } =
      req.body;
    try {
      let course = new Course({
        title: NameCourse,
        category: utils.convertId(CategoryCourse),
        teacher: req.user._doc._id,
        fee: {
          price: Fee,
          sale: 0,
        },
        smallPicture: filename,
        minDesc: MinDesc,
        fullDesc: FullDesc,
        createdOn: new Date(),
      });
      await course.save();

      const altCourse = await Course.findOne({
        title: NameCourse,
      });
      const trueDir =
        './public/images/' + altCourse.teacher + '/' + altCourse._id;
      await fs.promises.mkdir(trueDir, { recursive: true });

      await fs.promises.rename(dir + '/' + filename, trueDir + '/' + filename);

      res.redirect(`detail?courseId=${altCourse._id}`);
    } catch (err) {
      next(err);
    }
  },

  getHasJoin: async (req, res, next) => {
    const courseId = req.query.courseId;
    try {
      const morecourse = await MoreCourse.findOne({
        course: utils.convertId(courseId),
      }).elemMatch('students', { student: req.user._doc._id });
      if (morecourse) return res.json(true);
      res.json(false);
    } catch (err) {
      next(err);
    }
  },

  postJoin: async (req, res, next) => {
    try {
      const morecourse = await MoreCourse.findOneAndUpdate(
        {
          course: utils.convertId(req.body.id),
        },
        {
          $push: {
            students: {
              student: req.user._doc._id,
            },
          },
          $inc: {
            studentNum: 1,
          },
        },
        {
          new: true,
          useFindAndModify: false,
        }
      );

      await User.update(
        {
          _id: req.user._doc._id,
        },
        {
          $push: {
            courses: utils.convertId(req.body.id),
          },
        }
      );

      const course = await Course.findById(utils.convertId(req.body.id));

      await Category.update(
        {
          _id: course.category,
        },
        {
          $inc: {
            studentNum: 1,
          },
        }
      );

      res.redirect(`detail?courseId=${req.body.id}`);
    } catch (err) {
      next(err);
    }
  },

  getByCat: async (req, res, next) => {
    try {
      const categories = await Category.find({}).lean();
      const categoryId = req.query.categoryId;
      const courses = await Course.find({
        category: utils.convertId(categoryId),
      })
        .populate('teacher')
        .populate('category')
        .lean();
      req.session.courses = courses;

      const page = req.query.page;
      const perPage = 3;
      const altCourses = await Course.find({
        category: utils.convertId(categoryId),
      })
        .populate('teacher')
        .populate('category')
        .limit(perPage)
        .skip((page - 1) * perPage)
        .sort({
          createdOn: -1,
          updatedOn: -1,
        })
        .lean();

      const pages = [];
      let paginationNum = 0;
      if (courses.length / perPage == parseInt(courses.length / perPage)) {
        paginationNum = courses.length / perPage;
      } else paginationNum = parseInt(courses.length / perPage) + 1;
      for (i = 1; i <= paginationNum; i++) {
        pages.push(i);
      }

      res.render('vwCourse/course', {
        user: req.user ? req.user._doc : null,
        categories,
        categoryId,
        courses: altCourses,
        pages,
        empty: courses.length === 0,
      });
    } catch (err) {
      next(err);
    }
  },

  getDetail: async (req, res, next) => {
    try {
      const courseId = req.query.courseId;
      if (courseId) {
        const morecourse = await MoreCourse.findOneAndUpdate(
          {
            course: utils.convertId(courseId),
          },
          {
            $inc: {
              viewAmount: 1,
            },
          },
          {
            new: true,
            upsert: true,
            useFindAndModify: false,
          }
        )
          .populate({
            path: 'course',
            model: Course,
            populate: {
              path: 'teacher',
              model: User,
            },
          })
          .populate('students.student')
          .lean();

        let isIn = false;
        const userId = req.user ? req.user._doc._id : null;
        const studentNum = morecourse.students ? morecourse.students.length : 0;
        for (i = 0; i < studentNum; i++) {
          if (morecourse.students[i].student._id.equals(userId)) {
            isIn = true;
            break;
          }
        }
        const altMorecourses = await MoreCourse.find({
          course: { $ne: utils.convertId(courseId) },
        })
          .populate({
            path: 'course',
            model: 'Course',
            populate: [
              {
                path: 'category',
                model: Category,
                match: {
                  _id: morecourse.course.category,
                },
              },
              {
                path: 'teacher',
                model: User,
              },
            ],
          })
          .sort({
            studentNum: -1, // Descending
          })
          .lean();
        let altX = altMorecourses.filter((item) => {
          return item.course.category != null;
        });
        let altY = altX.slice(0, 5);
        //console.log(altMorecourses)
        //for (i = 0; i < 5; i++) {
        //    console.log(altMorecourses[i])
        //    altX.push(altMorecourses[i])
        //}

        const coursecontent = await CourseContent.findOne({
          course: utils.convertId(courseId),
        }).lean();
        const student = await User.findOne({
          watchlist: utils.convertId(courseId),
        });
        let preview = null;
        if (coursecontent) {
          if (coursecontent.content) preview = coursecontent.content[0];
        }

        res.render('vwCourse/detail', {
          user: req.user ? req.user._doc : null,
          morecourse,
          isIn,
          altMorecourses: altY,
          coursecontent,
          preview,
          alreadyFavor: student,
        });
      } else res.redirect('/no');
    } catch (err) {
      next(err);
    }
  },

  getFavorite: async (req, res, next) => {
    try {
      const courseId = req.query.courseId;
      if (courseId) {
        const student = await User.findOneAndUpdate(
          {
            _id: req.user._doc._id,
          },
          {
            $push: {
              watchlist: utils.convertId(courseId),
            },
          },
          {
            new: true,
            useFindAndModify: false,
          }
        );
        res.redirect(`detail?courseId=${courseId}`);
      } else res.redirect('/no');
    } catch (err) {
      next(err);
    }
  },

  postRating: async (req, res, next) => {
    try {
      const morecourse = await MoreCourse.findOneAndUpdate(
        {
          course: utils.convertId(req.body.id),
          'students.student': req.user._doc._id,
        },
        {
          $set: {
            'students.$.rate': req.body.rating,
            'students.$.feedback': req.body.feedback,
          },
        },
        {
          new: true,
          useFindAndModify: false,
        }
      );

      let sum = 0;
      let amount = 0;
      for (i = 0; i < morecourse.students.length; i++) {
        if (morecourse.students[i].rate) {
          sum += morecourse.students[i].rate;
          ++amount;
        }
      }
      const truerate = sum / amount;

      await Course.update(
        {
          _id: utils.convertId(req.body.id),
        },
        {
          $set: {
            rate: truerate,
            rateamount: amount,
          },
        }
      );

      res.redirect(`detail?courseId=${req.body.id}`);
    } catch (err) {
      next(err);
    }
  },
};
