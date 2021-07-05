module.exports = {
  getLogin: (req, res) => {
    res.render('login');
  },

  postLogin: (req, res) => {
    res.redirect('/');
  },

  getLogout: (req, res) => {
    req.logOut();
    req.session.destroy();
    res.redirect('/login');
  },
};
