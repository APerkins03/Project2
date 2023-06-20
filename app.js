// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();
app.set('trust proxy', 1);



const cookieParser = require("cookie-parser");

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// default value for title local
const capitalize = require("./utils/capitalize");
const projectName = "Project2";

app.locals.appTitle = `${capitalize(projectName)} created with IronLauncher`;

const MongoStore = require("connect-mongo");
const session = require("express-session");

app.set('trust proxy', 1);
  app.use(
    session({
      secret: "canBeAnything",
      resave: true,
      saveUninitialized: false,
      cookie: {
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 60000
      }, // ADDED code below !!!
      store: MongoStore.create({
        mongoUrl: 'mongodb://127.0.0.1:27017/Project2'
      })
    })
  );

  app.use(express.urlencoded({ extended: true }));


  app.use((req, res, next)=>{
    res.locals.user = req.session.currentUser || null;
    // this means in every hbs file i have a variable called {{user}}
    let isAdmin = false;
    if(req.session.currentUser && req.session.currentUser.Admin) isAdmin = true;
    res.locals.isAdmin = isAdmin;
    res.locals.errorMessage = req.flash("error");
    res.locals.successMessage = req.flash("success");
    next();
  });


// 👇 Start handling routes here



const indexRoutes = require("./routes/index");
app.use("/", indexRoutes);

const signupRoutes = require("./routes/user.routes");
app.use("/", signupRoutes);

const bbqRoutes = require("./routes/bbq.routes");
app.use("/", bbqRoutes);

const menuRoutes = require("./routes/menu.routes");
app.use("/", menuRoutes);

const aboutusRoutes = require("./routes/aboutus.routes");
app.use("/", aboutusRoutes);



// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;