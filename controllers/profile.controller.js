const User = require('../models/user');
const Category = require('../models/category');
const Course = require('../models/course');
const MoreCourse = require('../models/morecourse');
const CourseContent = require('../models/coursecontent');
const utils = require('../config/utils');
const bcrypt = require('bcrypt');
const multer = require('multer');
const fs = require('fs');

let filename = null;
let dir = null;
const limits = {
  fileSize: 100 * 1024 * 1024,
};
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
const upload = multer({
  limits,
  storage,
});

module.exports = {
  upload,

  getProfile: (req, res) => {
    res.render('vwProfile/profile', {
      user: req.user ? req.user._doc : null,
      favorite: true,
    });
  },

  getFavorite: async (req, res, next) => {
    try {
      const student = await User.findOne({
        _id: req.user._doc._id,
      })
        .populate({
          path: 'watchlist',
          model: 'Course',
          populate: [
            {
              path: 'teacher',
              model: 'User',
            },
            {
              path: 'category',
              model: 'Category',
            },
          ],
        })
        .lean();
      req.session.courses = student.watchlist;

      res.render('vwCourse/course', {
        user: req.user ? req.user._doc : null,
        courses: student.watchlist,
        favorite: true,
      });
    } catch (err) {
      next(err);
    }
  },

  deleteFavorite: async (req, res, next) => {
    const courseId = req.query.courseId;
    try {
      const student = await User.findOneAndUpdate(
        {
          _id: req.user._doc._id,
        },
        {
          $pull: {
            watchlist: utils.convertId(courseId),
          },
        },
        {
          new: true,
        }
      );

      res.redirect('favorite');
    } catch (err) {
      next(err);
    }
  },

  getAvailable: async (req, res, next) => {
    const username = req.query.username;
    const email = req.query.email;
    try {
      const user = await User.findOne({
        $or: [{ username: username }, { email: email }],
      });

      if (user) return res.json(false);
      res.json(true);
    } catch (err) {
      next(err);
    }
  },

  getCourseAvailable: async (req, res, next) => {
    const coursename = req.query.courseName;
    try {
      const course = await Course.findOne({
        title: coursename,
      });

      if (course) return res.json(false);
      else return res.json(true);
    } catch (err) {
      next(err);
    }
  },

  getFound: async (req, res, next) => {
    const password = req.query.password;
    try {
      const user = await User.findOne({
        username: req.user._doc.username,
      });
      const result = await bcrypt.compare(password, user.password);

      if (result) return res.json(true);
      res.json(false);
    } catch (err) {
      next(err);
    }
  },

  postProfile: async (req, res, next) => {
    let updatedValue = ({ fullname, username, email, n_password, desc } =
      req.body);

    for (let i in updatedValue) if (!updatedValue[i]) delete updatedValue[i];

    let isSuccessful = false;
    try {
      if (n_password) {
        const hashedPassword = await bcrypt.hash(n_password, 10);
        updatedValue.password = hashedPassword;
        isSuccessful = true;
      }
      const updatedUser = await User.findOneAndUpdate(
        {
          username: req.user._doc.username,
        },
        updatedValue,
        {
          new: true,
          useFindAndModify: false,
        }
      );
      res.render('vwProfile/profile', {
        isSuccessful,
      });
    } catch (err) {
      next(err);
    }
  },

  getMyCourse: async (req, res) => {
    if (req.user._doc.role === 1 || req.user._doc.role === 2) {
      var courses = await Course.find({
        teacher: req.user ? req.user._doc._id : null,
      })
        .populate('teacher')
        .populate('category')
        .lean();
    } else {
      const student = await User.findOne({
        _id: req.user ? req.user._doc._id : null,
      })
        .populate({
          path: 'courses',
          model: Course,
          populate: {
            path: 'teacher',
            model: User,
          },
        })
        .lean();
      var courses = student.courses;
    }

    req.session.courses = courses;

    res.render('vwCourse/course', {
      user: req.user ? req.user._doc : null,
      courses,
    });
  },

  getEdit: async (req, res, next) => {
    try {
      const categories = await Category.find({}).lean();
      const courseId = req.query.courseId;
      const course = await Course.findOne({
        _id: utils.convertId(courseId),
        teacher: req.user ? req.user._doc : null,
      })
        .populate('teacher')
        .populate('category')
        .lean();

      const coursecontent = await CourseContent.findOne({
        course: utils.convertId(courseId),
      }).lean();

      res.render('vwCourse/edit', {
        user: req.user ? req.user._doc : null,
        course,
        cat: categories,
        coursecontent,
      });
    } catch (err) {
      next(err);
    }
  },

  postEdit: async (req, res, next) => {
    try {
      const courseId = req.query.courseId;
      let updated = ({ title, price, sale, minDesc, fullDesc } = req.body);
      for (let i in updated) {
        if (!updated[i]) {
          delete updated[i];
        }
      }
      let update_course;
      if (price || sale) {
        update_course = {
          title: title,
          fee: {
            price: price,
            sale: sale,
          },
          minDesc: minDesc,
          fullDesc: fullDesc,
        };
      } else if (req.body.category) {
        update_course = {
          category: utils.convertId(req.body.category),
        };
      } else {
        update_course = {
          title: title,
          minDesc: minDesc,
          fullDesc: fullDesc,
        };
      }

      for (let i in update_course) {
        if (!update_course[i]) {
          delete update_course[i];
        }
      }

      const course = await Course.findOneAndUpdate(
        {
          _id: utils.convertId(courseId),
        },
        update_course,
        {
          useFindAndModify: false,
        }
      );

      if (req.body.category) {
        const morecourse = await MoreCourse.findOne({
          course: utils.convertId(courseId),
        }).populate('course');

        let studentCount = morecourse.students.length;
        await Category.update(
          {
            _id: course.category,
          },
          {
            $inc: {
              studentNum: -studentCount,
            },
          }
        );
        await Category.update(
          {
            _id: utils.convertId(req.body.category),
          },
          {
            $inc: {
              studentNum: studentCount,
            },
          }
        );
      }

      const titleX = req.body.titleX;
      if (filename && titleX) {
        const coursecontent = await CourseContent.findOneAndUpdate(
          {
            course: utils.convertId(courseId),
          },
          {},
          {
            new: true,
            upsert: true,
          }
        );
        let content = coursecontent.content ? coursecontent.content : {};
        content.push({
          chapter: 99,
          title: titleX,
          video: filename,
        });
        for (i = 0; i < content.length; i++) {
          content[i].chapter = i + 1;
        }

        const updatedCourseContent = await CourseContent.findOneAndUpdate(
          {
            course: utils.convertId(courseId),
          },
          {
            $set: {
              content,
            },
          },
          {
            upsert: true,
            useFindAndModify: false,
          }
        );
        const altCourse = await Course.findOne({
          _id: utils.convertId(courseId),
        });
        const trueDir =
          './public/videos/' + altCourse.teacher + '/' + altCourse._id;
        await fs.promises.mkdir(trueDir, { recursive: true });

        await fs.promises.rename(
          dir + '/' + filename,
          trueDir + '/' + filename
        );
      }

      const courseX = await Course.findOneAndUpdate(
        {
          _id: utils.convertId(courseId),
        },
        {
          $set: {
            updatedOn: new Date(),
          },
        }
      );

      res.redirect(`edit?courseId=${courseId}`);
    } catch (err) {
      next(err);
    }
  },

  getMarkComplete: async (req, res, next) => {
    const courseId = req.query.courseId;
    try {
      await Course.updateOne(
        {
          _id: utils.convertId(courseId),
        },
        {
          $set: {
            completed: true,
          },
        }
      );
      res.redirect(`edit?courseId=${courseId}`);
    } catch (err) {
      next(err);
    }
  },

  getMarkIncomplete: async (req, res, next) => {
    const courseId = req.query.courseId;
    try {
      await Course.updateOne(
        {
          _id: utils.convertId(courseId),
        },
        {
          $set: {
            completed: false,
          },
        }
      );
      res.redirect(`edit?courseId=${courseId}`);
    } catch (err) {
      next(err);
    }
  },
};
