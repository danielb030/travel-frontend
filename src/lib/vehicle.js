import axios from 'axios';
// import dotenv from 'dotenv';

// dotenv.config();

const requestAddress = 'https://escapadezanzibar.exclusive-technology.net';

export const getVehicleData = async () => {
  try {
    const records = await axios.get(`${requestAddress}/api/vehicle/`);
    return records.data;
  } catch (error) {
    return 500;
  }
};

export const putVehicleData = async (data) => {
  try {
    const records = await axios.post(`${requestAddress}/api/vehicle/putvehicledata`, data);
    return records.data;
  } catch (error) {
    return 500;
  }
};

export const deleteData = async (data) => {
  try {
    const records = await axios.post(`${requestAddress}/api/vehicle/deletedata`, data);
    return records.data;
  } catch (error) {
    return 500;
  }
};
