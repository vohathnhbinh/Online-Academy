module.exports = {
  getRegister: (req, res) => {
    res.render('register');
  },

  postRegister: async (req, res) => {
    const { username, email, password, fullname } = req.body;

    if (!res.locals.fail) {
      try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
          username,
          fullname,
          email,
          password: hashedPassword,
          role: 0,
          activated: false,
        });
        await user.save();
        res.redirect('/login');
      } catch (err) {
        console.log(err);
        res.render('register', {
          username,
          fullname,
          email,
        });
      }
    } else {
      res.render('register', {
        username,
        fullname,
        email,
      });
    }
  },
};
