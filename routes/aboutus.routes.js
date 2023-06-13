const express = require('express');
const router = express.Router();

/* About Us Routes */


router.get('/', (req, res) => {
    res.render('aboutus'); // Render the aboutus.hbs view
  });
  




  module.exports = router;