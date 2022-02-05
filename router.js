const express = require('express')
const route = express.Router();
const User = require('./models/user')
const bcrypt = require('bcrypt')
const {
    checkNotAuthenticated,
    checkAuthenticated
} = require('./middleware/auth')
const passport = require('passport')

//Routing
route.get('/',  checkAuthenticated,(req,res) => {
    res.send("index")
})

route.get('/login', checkNotAuthenticated, (req,res) => {
    res.render("login")
})

route.get('/register', checkNotAuthenticated,  (req,res) => {
    res.render("register")
})

route.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

route.post("/register", checkNotAuthenticated, async (req, res) => {
    const userFound = await User.findOne({ email: req.body.email });
  
    if (userFound) {
      req.flash("error", "User with that email already exists");
      res.redirect("/register");
    } else {
      try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword,
        });
  
        await user.save();
        res.redirect("/login");
      } catch (error) {
        console.log(error);
        res.redirect("/register");
      }
    }
  });
  
route.delete("/logout", (req, res) => {
    req.logOut();
    res.redirect("/login");
  });

module.exports = route;

