const express = require('express');
const router = express.Router();
const User = require('../models/user.model.js');
const bcryptjs = require('bcryptjs');

const mongoose = require("mongoose");

router.get("/signup", (req, res, next) => {
    res.render("users/signup");
})


router.post("/signup", (req, res, next) => {
    
const saltRounds = 10;

const username= req.body.username;
const password= req.body.password;
const email= req.body.email;
bcryptjs
.genSalt(saltRounds)
.then(salt => bcryptjs.hash(password, salt))
.then(hashedPassword => {

    User.create({username:username, passwordHash:hashedPassword, email:email})
    .then(() => {
        res.redirect("/login");
    })
})
.catch(error => next(error));
});

router.get("/login", (req, res, next) => {
    res.render("users/login");
});

router.post("/login", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    

    // the first thing we do is just to simply search through our databse and see if we find a user with a username matching what the person just typed in
    User.findOne({ username: req.body.username })
    .then(foundUser => {
        // this .then only happens after we search for a user with username equal to 
        // req.body.username and the promise resolves successfully
      if (!foundUser) {
        // this if only happens we successfully queries the databse and there is no user with that username
        req.flash("error", "Username or password Not Found");
        // for now we'll just console log an error message if we cant find a user with that username
        // we will add a package for error messages later
        res.redirect("/login");
        return;
        // the following else if only happens if there was an actual user found with 
        // username equal to req.body.username
      } else if (bcryptjs.compareSync(req.body.password, foundUser.password)) {
        // inside thise else if only happens if the password matches
        
        if(!foundUser.active){
          req.flash("error", "Account is not active, please check your email to verify your account");
          res.redirect("/login");
          return;
        } else {
          req.session.currentUser = foundUser;
          // ^ this is the magic right here this is how we log in
          req.flash("success", "Successfully Logged In");
          res.redirect('/userprofile');
        } 
      } else {
        // this else only happens if we found the user with the username but the passwords didnt match
        req.flash("error", "Password Do Not Match");
        res.redirect("/login");
        
      }
    })
    .catch(error => next(error));

});

module.exports = router;