if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const exphbs = require('express-handlebars');
const hbs_section = require('express-handlebars-sections');
const bodyParser = require('body-parser');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const {
  transporter,
  checkMailConnection,
} = require('./config/nodemailer_config');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());

app.use('/public', express.static('public'));

app.engine(
  'hbs',
  exphbs({
    extname: '.hbs',
    helpers: {
      section: hbs_section(),
    },
  })
);
app.set('view engine', 'hbs');
const hbs = exphbs.create({});
require('./config/helper')(hbs);

app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

require('./config/passport_config')(passport);

app.use(passport.initialize());
app.use(passport.session());

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Database connected'));

checkMailConnection(transporter);

app.use('/', require('./routes/home.route'));
app.use('/login', require('./routes/login.route')(passport));
app.use('/register', require('./routes/register.route'));
app.use('/profile', require('./routes/profile.route'));
app.use('/verify', require('./routes/verify.route'));
app.use('/course', require('./routes/course.route'));
app.use('/search', require('./routes/search.route'));
app.use('/watch', require('./routes/watch.route'));
app.use('/admin', require('./routes/admin.route'));

app.use((req, res) => {
  res.render('404', {
    layout: false,
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.render('500', {
    layout: false,
  });
});

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});
