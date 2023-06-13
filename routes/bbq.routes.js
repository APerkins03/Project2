const express = require('express');
const router = express.Router();

/* BBQ routes */


router.get('/', (req, res) => {
    res.render('bbq'); // Render the bbq.hbs view
  });
  




  module.exports = router;