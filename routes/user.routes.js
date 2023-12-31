const express = require('express');
const router = express.Router();
const User = require('../models/user.model.js');
const bcryptjs = require('bcryptjs');
const isLoggedIn = require('../utils/isLoggedin');
const Competition = require('../models/competition.model.js');
const searchHotels = require('./hotelApi');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const Event = require('../models/events.model');

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.fieldname + '-' + Date.now());
//   }
// });




const saltRounds = 10;

router.get("/signup", (req, res, next) => {
    res.render("users/signup");
});

router.post("/signup", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    if (!username || !password || !email) {
        req.flash("error", "Please provide all the required information.");
        res.redirect("/signup");
        return;
    }

    bcryptjs
        .genSalt(saltRounds)
        .then((salt) => bcryptjs.hash(password, salt))
        .then((hashedPassword) => {
            User.create({ username: username, passwordHash: hashedPassword, email: email })
                .then(() => {
                    res.redirect("/login");
                })
                .catch((error) => next(error));
        })
        .catch((error) => next(error));
});

router.get("/login", (req, res, next) => {
    res.render("users/login");
});

router.post("/login", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ username: req.body.username })
        .then(foundUser => {
            if (!foundUser) {
                req.flash("error", "Username or password not found");
                res.redirect("/login");
                return;
            } else if (foundUser.passwordHash && bcryptjs.compareSync(password, foundUser.passwordHash)) {
                if (foundUser.verified) {
                    req.session.currentUser = foundUser;
                    req.flash("success", "Successfully logged in");
                    res.redirect('/myprofile',);
                } else {
                    req.flash("error", "Account is not verified");
                    res.redirect("/login");
                }
            } else {
                req.flash("error", "Password does not match");
                res.redirect("/login");
            }
        })
        .catch(error => next(error));
});






// Route for events.hbs
router.get('/events', async (req, res) => {
  try {
    const events = await Event.find().populate('user');
    res.render('users/events', { events }); // Render the events.hbs view and pass the events data
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});




// Route for eventchanges.hbs
router.get('/eventchanges', (req, res) => {
  res.render('users/eventchanges'); // Assuming the eventchanges.hbs file is in your views directory
});

router.get("/appchanges", (req, res, next) => {
 res.render("users/appchanges");
});
router.post('/appchanges', isLoggedIn, (req, res, next) => {
 const { teamName, headCook, fbaNum, address, city, state, zip, phone, email } = req.body;
 const userData = {
 teamName,
 headCook,
 fbaNum,
 address,
 city,
 state,
 zip,
 phone,
 email
 };

  // Update the user's profile in the database
 User.findByIdAndUpdate(
 req.session.currentUser._id,
 userData,
 { new: true }
 )
 .then(updatedUser => {
 if (!updatedUser) {
 req.flash('error', 'User not found');
 res.redirect('/login');
 return;
 }

      // Redirect to the appropriate page after updating the user profile
 req.flash('success', 'Profile updated successfully');
 res.redirect('/myprofile');
 })
  .catch(error => next(error));
});

router.get("/appchanges/:theID", (req, res)=>{
  // when you have something with a : in the route
  // that means the route will never go to 
  //  /guitars/theID it will go to something like /guitars/14hfh253534
  // whatever value actually gets put into the URL, will be accessible
  // as req.params.theID
 Competition.findById(req.params.theID)
 .then((theCompetition)=>{
 res.render("appchanges", {theCompetition:theCompetition})
 })
 .catch((err)=>{
 console.log(err);
});
});


router.get('/userprofile', (req, res, next) => {
 if (!req.session.currentUser || !req.session.currentUser._id) {
 req.flash('error', 'User not found');
 res.redirect('/login');
 return;
 }

 User.findById(req.session.currentUser._id)
.then(foundUser => {
 if (!foundUser) {
 req.flash('error', 'User not found');
 res.redirect('/login');
 return;
 }
 res.render('users/userprofile', { currentUser: foundUser });
 })
 .catch(error => next(error));
});
 router.post("/userprofile", (req, res, next) => {
 const { teamName, headCook, fbaNum, address, city, state, zip, phone, email } = req.body;
 const userData = {
 teamName,
 headCook,
 fbaNum,
 address,
 city,
 state,
 zip,
 phone,
 email
 };

    // Update the user's profile in the database
User.findByIdAndUpdate(
 req.session.currentUser._id,
 userData,
 { new: true }
 )
 .then(updatedUser => {
 if (!updatedUser) {
 req.flash('error', 'User not found');
 res.redirect('/login');
 return;
 }

      // Create a new Competition instance with form data
 const newCompetition = new Competition({
 teamName: updatedUser.teamName,
 headCook: updatedUser.headCook,
 fbaNum: updatedUser.fbaNum,
 address: updatedUser.address,
 city: updatedUser.city,
 state: updatedUser.state,
 zip: updatedUser.zip,
 phone: updatedUser.phone,
 email: updatedUser.email,
 user: updatedUser._id // Link the user ID to the competition record
 });

      // Save the new competition to the database
 newCompetition.save()
 .then(() => {
 req.flash('success', 'Profile and competition information updated successfully');
 res.redirect('/myprofile');
 })
 .catch(error => {
 req.flash('error', 'Failed to save competition information');
 next(error); // Pass the error to the error-handling middleware
 });
 })
 .catch(error => next(error)); // Pass the error to the error-handling middleware

req.flash('success', 'Profile updated successfully');
     // Redirect to the myprofile page, passing the updated user data
 res.redirect('/myprofile');  
 
 })
 

 
 
 router.get('/myprofile', isLoggedIn, (req, res, next) => {
    // Check if the user is logged in
 if (!req.session.currentUser) {
 res.redirect('/login');
 return;
 }

// Retrieve the user's profile from the database
 User.findById(req.session.currentUser._id)
 .then(foundUser => {
 if (!foundUser) {
 req.flash('error', 'User not found');
 res.redirect('/login');
 return;
 }
 
 res.render('users/myprofile', { user: foundUser });
 })
 .catch(error => next(error));
 });
 
 router.post('/userprofile/update', isLoggedIn, (req, res, next) => {
 if (!req.session.currentUser) {
 res.redirect('/login');
 return;
 }
 const userId = req.session.currentUser._id;
 const {
 teamName,
 headCook,
 fbaNum,
 address,
 city,
 state,
 zip,
 phone,
 email
 } = req.body;
 
 const competitionData = {
 teamName,
 headCook,
 fbaNum,
 address,
 city,
 state,
 zip,
 phone,
 email,
 user: userId
 };
 
User.findByIdAndUpdate(userId, req.body, { new: true })
 .then(updatedUser => {
 if (!updatedUser) {
 req.flash('error', 'User not found');
res.redirect('/login');
 return;
 }
 
        // Check if a competition already exists for the user
 Competition.findOne({ user: userId })
 .then(existingCompetition => {
 if (existingCompetition) {
              // Update the existing competition
 existingCompetition.set(competitionData);
 return existingCompetition.save();
 } else {
              // Create a new competition
 const newCompetition = new Competition(competitionData);
 return newCompetition.save();
 }
 })
 .then(() => {
 req.flash('success', 'Profile and competition information updated successfully');
 res.redirect('/myprofile');
 })
 .catch(error => {
 req.flash('error', 'Failed to update competition information');
next(error);
 });
 })
 .catch(error => next(error));
 });
 
  // // Route to handle deleting the user profile
  // router.get('/myprofile', isLoggedIn, (req, res, next) => {
  //   // Check if the user is logged in
  //   if (!req.session.currentUser) {
  //     res.redirect('/login');
  //     return;
  //   }
 
  //   // Retrieve the user's profile from the database
  //   User.findById(req.session.currentUser._id)
  //     .then(foundUser => {
  //       if (!foundUser) {
  //         req.flash('error', 'User not found');
  //         res.redirect('/login');
  //         return;
  //       }
 
  //       res.render('users/myprofile', { user: req.body });
  //     })
  //     .catch(error => next(error));
  // });
 
  // Route to handle form submission and update user profile
 router.post('/myprofile/update', isLoggedIn, (req, res, next) => {
    // Check if the user is logged in
 if (!req.session.currentUser) {
 res.redirect('/login');
 return;
 }

// Update the user's profile in the database
 User.findByIdAndUpdate(
 req.session.currentUser._id,
 req.body,
 { new: true }
 )
 .then(updatedUser => {
 if (!updatedUser) {
 req.flash('error', 'User not found');
 res.redirect('/login');
 return;
}

 req.flash('success', 'Profile updated successfully');
        // Redirect to the myprofile page, passing the updated user data
 res.redirect('/myprofile');
 })
 .catch(error => next(error));
 });
  
 router.get("/photos", (req, res, next) => {
 res.render("users/photos");
  });
  
  
  //   router.get('/photos', async (req, res) => {
  //     try {
  //       // Check if a file was uploaded
  //       if (!req.file) {
  //         return res.status(400).send('No file uploaded');
  //       }
  //       // Upload the file to Cloudinary
  //       const photo = req.files.photo;
  //       const result = await cloudinary.api.resources({ type: 'upload' });

  //       // Handle the uploaded photo data (e.g., save to a database, return a response)
  //       // Example: Save the photo URL to a user's profile
  //       // const user = await User.findById(req.user.id);
  //       // user.photoUrl = result.secure_url;
  //       // await user.save();

  //       // Return a response with the uploaded photo data
  //       res.render('photos', { photos: result.resources });
  //     } catch (error) {
  //       console.error(error);
  //       res.status(500).send('Server Error');
  //     }
  //   });


  // router.get('/photos', (req, res) => {
  //   // Fetch the uploaded photos from Cloudinary
  //   cloudinary.api.resources({ type: 'upload' })
  //     .then((result) => {
  //       const photos = result.resources;
  //       res.render('photos', { photos });
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //       res.render('photos', { error: 'Failed to fetch photos' });
  //     });
  // });
  
  
router.get('/bbq', async (req, res, next) => {
res.render('bbqcompetition');
});

router.post('/bbq', async (req, res, next) => {
try {
const location = req.body.location;
 const hotelData = await searchHotels(location);

 res.render('hotel', { hotelData: hotelData });
 } catch (error) {
 console.error(error);
res.render('error', { error: 'Failed to fetch attraction data' });
 }
 });


 
 
 router.post("/logout", (req, res, next)=>{
 req.session.destroy();
 res.redirect("/");
 });
  
 module.exports = router;
  
  
