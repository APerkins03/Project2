const express = require('express');
const router = express.Router();
const User = require('../models/user.model.js');
const bcryptjs = require('bcryptjs');
const isLoggedIn = require("../utils/isLoggedin");
const Competition = require('../models/competition.model.js');
const mongoose = require("mongoose");

app.get('/myprofile', async (req, res) => {
    try {
      // Get the currently authenticated user's ID from the session or authentication credentials
      const userId = req.session.userId; // Replace with your authentication method
  
      // Retrieve the user's profile from the database based on their ID
      const userProfile = await UserProfile.findOne({ userId });
  
      if (!userProfile) {
        // Handle the case when the user profile does not exist
        return res.status(404).send('User profile not found');
      }
  
      // Render the user profile template with the retrieved profile data
      res.render('myprofile', { userProfile });
    } catch (error) {
      // Handle any errors that occur during the process
      console.error('Error retrieving user profile:', error);
      res.status(500).send('Server error');
    }
  });