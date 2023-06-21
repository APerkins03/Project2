const express = require('express');
const router = express.Router();
const axios = require('axios');
const searchHotels = require('./hotelApi.js');


/* BBQ routes */


router.get('/', (req, res) => {
    res.render('bbq'); // Render the bbq.hbs view
  });
  
  router.get("/hotel", async (req, res, next) => {
    const options = {
      method: 'GET',
      url: 'rapidapi.com',
      headers: {
        'X-RapidAPI-Key': 'https://hotels4.p.rapidapi.com/v2/get-meta-data',
        'X-RapidAPI-Host': 'hotels4.p.rapidapi.com'
      }
    };
  
    try {
      const response = await axios.request(options);
      const apiData = response.data;
  
      res.render("hotel", { apiData });
    } catch (error) {
      console.error(error);
      res.render("hotel", { error: "Failed to fetch API data" });
    }
  });

  router.post('/hotel', async (req, res, next) => {
    try {
      const location = req.body.location;
      const hotelData = await searchHotels(location);
  
      res.render('hotel', { hotelData: hotelData.results });
    } catch (error) {
      console.error(error);
      res.render('hotel', { error: 'Failed to fetch hotel data' });
    }
  });



  module.exports = router;