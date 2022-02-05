const express = require('express');
const mongoose = require('mongoose');
const flash = require('express-flash');
const session = require('express-session');
const app = express();
const PORT = 3000;
const path = require('path');
const User = require('./models/user');
const passport = require('passport');
const initializePassport = require('./passport-config');
const methodOverride = require('method-override');
require('dotenv').config();

//passport
initializePassport(
    passport,
    async(email) => {
        const userFound = await User.findOne ({email})
        return userFound;
    },
    async(id) => {
        const userFound = await User.findOne({ _id: id})
        return userFound;
    }
)
 

//middleware
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended : false}))
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));
app.use(express.static("public"));

//koneksi database
mongoose.connect('mongodb+srv://admin:admin@cluster0.upbaa.mongodb.net/dbs1?retryWrites=true&w=majority')
.then(() => {
    app.listen(PORT, () => {
        console.log(`app running on http://localhost:${PORT}`)
    })
}).catch((err) => {
    console.log(err)
})

//rendering
app.use('/css', express.static(path.resolve(__dirname, "assets/css")))

//router
app.use('/', require('./router'))