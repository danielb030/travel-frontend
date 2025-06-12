import axios from 'axios';
// import dotenv from 'dotenv';

// dotenv.config();

const requestAddress = 'https://travel-tefy.onrender.com';

export const getDriverData = async () => {
  try {
    const records = await axios.get(`${requestAddress}/api/driver/`);
    return records.data;
  } catch (error) {
    return 500;
  }
};

export const getDriverDataWithDate = async (data) => {
  try {
    const records = await axios.post(`${requestAddress}/api/driver/`, data);
    return records.data;
  } catch (error) {
    return 500;
  }
};

export const putDriverData = async (data) => {
  try {
    const records = await axios.post(`${requestAddress}/api/driver/putdriverdata`, data);
    return records.data;
  } catch (error) {
    return 500;
  }
};

export const deleteDriverData = async (data) => {
  try {
    const records = await axios.post(`${requestAddress}/api/driver/deletedata`, data);
    return records.data;
  } catch (error) {
    return 500;
  }
};
