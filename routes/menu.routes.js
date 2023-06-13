const express = require('express');
const router = express.Router();

/* Menu Routes */


router.get('/', (req, res) => {
    res.render('menu'); // Render the bbq.hbs view
  });
  




  module.exports = router;