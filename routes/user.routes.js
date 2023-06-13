const express = require('express');
const router = express.Router();
const User = require('../models/user.model.js');
const bcryptjs = require('bcryptjs');

const mongoose = require("mongoose");

router.get("/", (req, res, next) => {
    res.render("users/signup");
})

router.post("/", (req, res, next) => {
const saltRounds = 10;

const username= req.body.username;
const password= req.body.password;
const email= req.body.email;
bcryptjs
.genSalt(saltRounds)
.then(salt => bcryptjs.hash(password, salt))
.then(hashedPassword => {

    user.create({username:username, passwordHash:hashedPassword})
    .then(() => {
        res.redirect("/users/login");
    })
})
.catch(error => next(error));
});

router.get("/login", (req, res, next) => {
    res.render("users/login");
})


module.exports = router;