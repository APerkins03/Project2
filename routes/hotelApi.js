const axios = require('axios');
require('dotenv').config();

const searchHotels = async (location) => {
  const options = {
    method: 'GET',
    url: 'https://booking-com.p.rapidapi.com/v1/hotels/locations',
    params: {
      name: location,
      locale: 'en-gb'
    },
    headers: {
      'X-RapidAPI-Key': process.env.X-RAPIDAPI-KEY,
      'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
    }
  };
  
  try {
    const response = await axios.request(options);
    console.log(response.data);
    return(response.data);
  } catch (error) {
    console.error(error);
  }
}
module.exports = searchHotels;