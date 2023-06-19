const express = require('express');
const router = express.Router();


/* BBQ routes */


router.get('/', (req, res) => {
    res.render('bbq'); // Render the bbq.hbs view
  });
  
  router.get("/bbq", async (req, res, next) => {
    const options = {
      method: 'GET',
      url: 'https://hotels4.p.rapidapi.com/v2/get-meta-data',
      headers: {
        'X-RapidAPI-Key': '392f218736msh253c88d6d10029bp15aef5jsnf32649a757f3',
        'X-RapidAPI-Host': 'hotels4.p.rapidapi.com'
      }
    };
  
    try {
      const response = await axios.request(options);
      const apiData = response.data;
  
      res.render("bbq", { apiData });
    } catch (error) {
      console.error(error);
      res.render("bbq", { error: "Failed to fetch API data" });
    }
  });




  module.exports = router;