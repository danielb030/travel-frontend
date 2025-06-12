import axios from 'axios';
// import dotenv from 'dotenv';

// dotenv.config();

const requestAddress = 'https://travel-tefy.onrender.com';

export const getGuidData = async () => {
  try {
    const records = await axios.get(`${requestAddress}/api/guid/`);
    return records.data;
  } catch (error) {
    return 500;
  }
};

export const putGuidData = async (data) => {
  try {
    const records = await axios.post(`${requestAddress}/api/guid/putguiddata`, data);
    return records.data;
  } catch (error) {
    return 500;
  }
};

export const deleteData = async (data) => {
  try {
    const records = await axios.post(`${requestAddress}/api/guid/deletedata`, data);
    return records.data;
  } catch (error) {
    return 500;
  }
};
