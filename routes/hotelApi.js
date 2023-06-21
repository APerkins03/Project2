const axios = require('axios');


const searchHotels = async (location) => {
  const options = {
    method: 'GET',
    url: 'https://booking-com.p.rapidapi.com/v1/hotels/locations',
    params: {
      name: location,
      locale: 'en-gb'
    },
    headers: {
      'X-RapidAPI-Key': '392f218736msh253c88d6d10029bp15aef5jsnf32649a757f3',
      'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
    }
  };
  
  try {
    const response = await axios.request(options);
    return response.data; // Return the retrieved hotel data
  } catch (error) {
    console.error(error);
    throw error; // Throw the error to be caught in the calling function
  }
};

module.exports = searchHotels;