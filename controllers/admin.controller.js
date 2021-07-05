const Category = require('../models/category');
const Course = require('../models/course');
const User = require('../models/user');
const utils = require('../config/utils');

module.exports = {
  getAdmin: async (req, res) => {
    res.render('vwAdmin/admin', {
      user: req.user ? req.user._doc : null,
    });
  },

  getCategory: async (req, res, next) => {
    try {
      const categories = await Category.find({}).lean();

      const catTYPE = categories
        .map((item) => item.type)
        .filter((value, index, self) => self.indexOf(value) === index);

      res.render('vwAdmin/category', {
        user: req.user ? req.user._doc : null,
        cat: categories,
        catTYPE,
      });
    } catch (err) {
      next(err);
    }
  },

  postCategory: async (req, res, next) => {
    try {
      const id = req.query.id;

      const catname = req.body.catname;
      const updatedCatName = req.body[catname];

      const cattype = req.body.cattype;
      const updatedCatType = req.body[cattype];

      const updatedCat = {
        name: updatedCatName,
        type: updatedCatType,
      };
      for (let i in updatedCat) {
        if (!updatedCat[i]) {
          delete updatedCat[i];
        }
      }

      const category = await Category.findOneAndUpdate(
        {
          _id: utils.convertId(id),
        },
        updatedCat,
        {
          new: true,
        }
      );
      res.redirect('category');
    } catch (err) {
      next(err);
    }
  },

  deleteCategory: async (res, req, next) => {
    try {
      const id = req.query.id;
      const category = await Category.findOne({
        _id: utils.convertId(id),
      });

      if (category.studentNum > 0) {
        const categories = await Category.find({}).lean();

        const catTYPE = categories
          .map((item) => item.type)
          .filter((value, index, self) => self.indexOf(value) === index);

        res.render('vwAdmin/category', {
          user: req.user ? req.user._doc : null,
          cat: categories,
          catTYPE,
          error: true,
        });
      } else {
        await Category.deleteOne({
          _id: utils.convertId(id),
        });
        res.redirect('category');
      }
    } catch (err) {
      next(err);
    }
  },

  getAvailable: async (req, res, next) => {
    const catname = req.query.catname;
    try {
      const category = await Category.findOne({
        name: catname,
      });

      if (category) return res.json(false);
      res.json(true);
    } catch {
      next(err);
    }
  },

  postAddCat: async (req, res, next) => {
    const { catName, catType } = req.body;
    try {
      const category = new Category({
        name: catName,
        type: catType,
      });

      await category.save();
      res.redirect('category');
    } catch (err) {
      next(err);
    }
  },

  getCourse: async (req, res, next) => {
    try {
      const courses = await Course.find({})
        .populate('teacher')
        .populate('category')
        .sort({
          createdOn: -1,
          updatedOn: -1,
        })
        .lean();
      req.session.courses = courses;

      const categories = await Category.find({}).lean();
      const teachers = await User.find({
        role: 1,
      }).lean();

      res.render('vwAdmin/xcourse', {
        user: req.user ? req.user._doc : null,
        courses,
        cat: categories,
        teachers,
      });
    } catch (err) {
      next(err);
    }
  },

  getDisable: async (req, res, next) => {
    const courseId = req.query.courseId;
    try {
      await Course.updateOne(
        {
          _id: utils.convertId(courseId),
        },
        {
          $set: {
            disabled: true,
          },
        }
      );
      res.redirect('course');
    } catch (err) {
      next(err);
    }
  },

  getEnable: async (req, res, next) => {
    const courseId = req.query.courseId;
    try {
      await Course.updateOne(
        {
          _id: utils.convertId(courseId),
        },
        {
          $set: {
            disabled: false,
          },
        }
      );
      res.redirect('course');
    } catch (err) {
      next(err);
    }
  },

  postFilter: async (req, res, next) => {
    try {
      const { category, teacher } = req.body;

      let courses;
      if (category && teacher) {
        courses = await Course.find({
          category: utils.convertId(category),
          teacher: utils.convertId(teacher),
        }).lean();
      } else if (category) {
        courses = await Course.find({
          category: utils.convertId(category),
        }).lean();
      } else if (teacher) {
        courses = await Course.find({
          teacher: utils.convertId(teacher),
        }).lean();
      }
      req.session.courses = courses;

      const categories = await Category.find({}).lean();
      const teachers = await User.find({
        role: 1,
      }).lean();

      res.render('vwAdmin/xcourse', {
        user: req.user ? req.user._doc : null,
        courses,
        cat: categories,
        teachers,
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

      const teachers = await User.find({
        role: 1,
      }).lean();

      res.render('vwAdmin/xcourse', {
        user: req.user ? req.user._doc : null,
        cat: categories,
        courses,
        teachers,
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

      const teachers = await User.find({
        role: 1,
      }).lean();

      res.render('vwAdmin/xcourse', {
        user: req.user ? req.user._doc : null,
        cat: categories,
        courses,
        teachers,
        empty: courses.length === 0,
      });
    } catch (err) {
      next(err);
    }
  },

  getUser: async (req, res, next) => {
    try {
      const students = await User.find({
        role: 0,
      }).lean();
      const teachers = await User.find({
        role: 1,
      }).lean();

      res.render('vwAdmin/user', {
        user: req.user ? req.user._doc : null,
        students,
        teachers,
      });
    } catch (err) {
      next(err);
    }
  },

  getMakeTeacher: async (req, res, next) => {
    const userId = req.query.id;
    try {
      await User.updateOne(
        {
          _id: utils.convertId(userId),
        },
        {
          $set: {
            role: 1,
          },
        }
      );
      res.redirect('user');
    } catch (err) {
      next(err);
    }
  },

  getLock: async (req, res, next) => {
    const userId = req.query.id;
    try {
      await User.updateOne(
        {
          _id: utils.convertId(userId),
        },
        {
          $set: {
            locked: true,
          },
        }
      );
      res.redirect('user');
    } catch (err) {
      next(err);
    }
  },

  getUnlock: async (req, res, next) => {
    const userId = req.query.id;
    try {
      await User.updateOne(
        {
          _id: utils.convertId(userId),
        },
        {
          $set: {
            locked: false,
          },
        }
      );
      res.redirect('user');
    } catch (err) {
      next(err);
    }
  },
};
