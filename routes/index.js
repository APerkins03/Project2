const express = require('express');
const router = express.Router();


/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

const menuRoutes = require("./menu.routes");
router.use("/menu", menuRoutes);

const bbqRoutes = require("./bbq.routes");
router.use("/bbq", bbqRoutes)

const signupRoutes = require("./user.routes");
router.use("/signup", signupRoutes)

const aboutusRoutes = require("./aboutus.routes");
router.use("/aboutus", aboutusRoutes)






module.exports = router;