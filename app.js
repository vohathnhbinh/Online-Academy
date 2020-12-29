if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const exphbs  = require('express-handlebars');
const hbs_section = require('express-handlebars-sections')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
 
const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.engine('hbs', exphbs({
    extname: '.hbs',
    helpers: {
        section: hbs_section()
    }
}));
app.set('view engine', 'hbs');

app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

require('./config/passport_config')(passport)
 
app.use(passport.initialize())
app.use(passport.session())

const mongoose = require("mongoose")
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Database connected'))
 
app.use('/', require('./routes/home'))
const loginRoute = require('./routes/login')(passport)
app.use('/login', loginRoute)
app.use('/register', require('./routes/register'))
app.use('/profile', require('./routes/profile'))
app.use('/verify', require('./routes/verify'))

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});