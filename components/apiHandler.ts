import axios from 'axios';

const API_URL = 'https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_x8dP7xkSDwOcoE0LloToBSn1P9kF3lv5JMj5aGiH';

export const getExchangeRates = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    throw error;
  }
};