const LocalStratedy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user');

module.exports = (passport) => {
  const authenticateUser = async (username, password, done) => {
    const re =
      /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    let email;
    if (re.test(username)) {
      email = username;
    }
    try {
      const user = await User.findOne({
        $or: [{ username: username }, { email: email }],
      });
      if (!user)
        return done(null, false, { message: 'Incorrect username or email' });
      else {
        const result = await bcrypt.compare(password, user.password);
        if (result) return done(null, user);
        else return done(null, false, { message: 'Incorrect password' });
      }
    } catch (err) {
      console.log(err);
    }
  };

  passport.use(new LocalStratedy(authenticateUser));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    return done(null, await User.findById(id));
  });
};
