const Course = require('../models/course');
const Category = require('../models/category');

module.exports = {
  getSearch: async (req, res, next) => {
    const result = req.query.q;
    try {
      const categories = await Category.find({}).lean();
      const courses = await Course.find({
        $text: {
          $search: result,
        },
      })
        .populate('teacher')
        .populate('category')
        .lean();
      req.session.courses = courses;

      const page =
        req.query.page <= courses.length || req.query.page ? req.query.page : 1;
      const perPage = 3;
      const altCourses = await Course.find({
        $text: {
          $search: result,
        },
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
      if (courses.length % perPage === 0) {
        paginationNum = courses.length / perPage;
      } else paginationNum = Math.floor(courses.length / perPage) + 1;
      for (i = 1; i <= paginationNum; i++) {
        pages.push(i);
      }

      res.render('vwCourse/course', {
        user: req.user ? req.user._doc : null,
        categories,
        courses: altCourses,
        searchQ: result,
        pages,
        empty: courses.length === 0,
      });
    } catch (err) {
      next(err);
    }
  },

  getSortFee: async (req, res, next) => {
    const courses = req.session.courses;
    try {
      const categories = await Category.find({}).lean();
      courses.sort((a, b) => a.fee.price - b.fee.price);

      res.render('vwCourse/course', {
        user: req.user ? req.user._doc : null,
        categories,
        courses,
        empty: courses.length === 0,
      });
    } catch (err) {
      next(err);
    }
  },

  getSortRating: async (req, res, next) => {
    const courses = req.session.courses;
    try {
      const categories = await Category.find({}).lean();
      courses.sort((a, b) => b.rate - a.rate);

      res.render('vwCourse/course', {
        user: req.user ? req.user._doc : null,
        categories,
        courses,
        empty: courses.length === 0,
      });
    } catch (err) {
      next(err);
    }
  },
};
