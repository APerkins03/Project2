const axios = require('axios');
require('dotenv').config();

const searchHotels = async (location) => {
  const options = {
    method: 'GET',
    url: 'https://hotels4.p.rapidapi.com/locations/search',
    params: {
      query: location,
      locale: 'en_US',
    },
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': process.env.RAPIDAPI_HOST,
    },
  };

  try {
    const response = await axios.request(options);
    console.log(response.data); // Add this line to check the API response
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch hotel data');
  }
};

module.exports = searchHotels;