if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const exphbs  = require('express-handlebars');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
 
const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
 
app.engine('hbs', exphbs({
    extname: '.hbs'
}));
app.set('view engine', 'hbs');

const mongoose = require("mongoose")
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true
})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connect to Mongoose'))
 
app.use('/', require('./routes/home'))
app.use('/login', require('./routes/login'))
app.use('/register', require('./routes/register'))

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});