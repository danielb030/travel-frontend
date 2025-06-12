import axios from 'axios';
// import dotenv from 'dotenv';

// dotenv.config();

const requestAddress = 'https://travel-tefy.onrender.com';

export const getHotelData = async () => {
  try {
    const records = await axios.get(`${requestAddress}/api/hotel/`);
    return records.data;
  } catch (error) {
    return 500;
  }
};

export const putHotelData = async (data) => {
  try {
    const records = await axios.post(`${requestAddress}/api/hotel/puthoteldata`, data);
    return records.data;
  } catch (error) {
    return 500;
  }
};

export const deleteHotelData = async (data) => {
  try {
    const records = await axios.post(`${requestAddress}/api/hotel/deletedata`, data);
    return records.data;
  } catch (error) {
    return 500;
  }
};
