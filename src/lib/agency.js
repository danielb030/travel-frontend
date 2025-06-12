import axios from 'axios';
// import dotenv from 'dotenv';

// dotenv.config();

const requestAddress = 'https://travel-tefy.onrender.com';

export const getAgencyData = async () => {
  try {
    const records = await axios.get(`${requestAddress}/api/agency/`);
    return records.data;
  } catch (error) {
    return 500;
  }
};

export const putAgencyData = async (data) => {
  try {
    const records = await axios.post(`${requestAddress}/api/agency/putagencydata`, data);
    return records.data;
  } catch (error) {
    return 500;
  }
};

export const deleteAgencyData = async (data) => {
  try {
    const records = await axios.post(`${requestAddress}/api/agency/deletedata`, data);
    return records.data;
  } catch (error) {
    return 500;
  }
};
