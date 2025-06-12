import axios from 'axios';
// import dotenv from 'dotenv';

// dotenv.config();

const requestAddress = 'https://escapadezanzibar.exclusive-technology.net';

export const getDriverListData = async () => {
  try {
    const records = await axios.get(`${requestAddress}/api/driver-list`);
    return records.data;
  } catch (error) {
    return 500;
  }
};

export const putDriverListData = async (data) => {
  try {
    const records = await axios.post(`${requestAddress}/api/driver-list/put-driver-list`, data);
    return records.data;
  } catch (error) {
    return 500;
  }
};

export const deleteDriverListData = async (data) => {
  try {
    const records = await axios.post(`${requestAddress}/api/driver-list/deletedata`, data);
    return records.data;
  } catch (error) {
    return 500;
  }
};
