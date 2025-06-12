import axios from 'axios';
// import dotenv from 'dotenv';

// dotenv.config();

const requestAddress = 'https://escapadezanzibar.exclusive-technology.net';

export const getServiceData = async () => {
  try {
    const records = await axios.get(`${requestAddress}/api/service/`);
    return records.data;
  } catch (error) {
    return 500;
  }
};

export const putServiceData = async (data) => {
  try {
    const records = await axios.post(`${requestAddress}/api/service/putservicedata`, data);
    return records.data;
  } catch (error) {
    return 500;
  }
};

export const deleteData = async (data) => {
  try {
    const records = await axios.post(`${requestAddress}/api/service/deletedata`, data);
    return records.data;
  } catch (error) {
    return 500;
  }
};
