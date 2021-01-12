if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const exphbs  = require('express-handlebars')
const hbs_section = require('express-handlebars-sections')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')

const app = express()
const port = process.env.PORT || 8080

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/public', express.static('public'))

app.engine('hbs', exphbs({
    extname: '.hbs',
    helpers: {
        section: hbs_section()
    }
}));
app.set('view engine', 'hbs')
const hbs = exphbs.create({})
require('./config/helper')(hbs)

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
 
app.use('/', require('./routes/home.route'))
const loginRoute = require('./routes/login.route')(passport)
app.use('/login', loginRoute)
app.use('/register', require('./routes/register.route'))
app.use('/profile', require('./routes/profile.route'))
app.use('/verify', require('./routes/verify.route'))
app.use('/course', require('./routes/course.route'))
app.use('/search', require('./routes/search.route'))
app.use('/watch', require('./routes/watch.route'))
app.use('/admin',require('./routes/admin.route'))

app.use(function(req,res){
    res.render('404',{
        layout: false 
    });
})

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.render('500', {
        layout: false
    })
})

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});