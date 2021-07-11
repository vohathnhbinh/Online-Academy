module.exports = {
  checkAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }

    res.redirect('/login');
  },
  checkNotAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return res.redirect('/');
    }

    next();
  },
  checkVerified: (req, res, next) => {
    if (req.user._doc.activated) {
      return next();
    }

    res.redirect('/verify');
  },
  checkNotVerified: (req, res, next) => {
    if (req.user._doc.activated) {
      return res.redirect('/');
    }

    next();
  },
  checkAdmin: (req, res, next) => {
    if (req.user) {
      if (req.user._doc.role === 2) {
        return next();
      }
    }

    res.redirect('/');
  },
  checkNotLocked: (req, res, next) => {
    if (req.user) {
      if (req.user._doc.locked) {
        return res.redirect('/');
      }
    }

    next();
  },
};
