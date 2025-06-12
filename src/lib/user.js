import axios from 'axios';
// import dotenv from 'dotenv';
// import Cookies from 'js-cookie';

import { axiosApi } from './axios';

// dotenv.config();

const requestAddress = 'https://travel-tefy.onrender.com';

const setTokenWithExpiry = (key, token, expiryTimeInMinutes) => {
  const now = new Date();

  // Set the expiry time in minutes
  const expiryTime = now.getTime() + expiryTimeInMinutes * 60 * 1000;

  const tokenObject = {
    token,
    expiry: expiryTime,
  };

  localStorage.setItem(key, JSON.stringify(tokenObject));
};

export const getTokenWithExpiry = (key) => {
  const tokenString = localStorage.getItem(key);

  if (!tokenString) {
    return null;
  }

  const tokenObject = JSON.parse(tokenString);
  const now = new Date();

  // Check if the token has expired
  if (now.getTime() > tokenObject.expiry) {
    localStorage.removeItem(key); // Remove expired token
    return null;
  }

  return tokenObject.token;
};

export const signUp = async (user) => {
  try {
    const response = await axiosApi.post('/auth/signup', user);
    setTokenWithExpiry('token', response.data.token, 60); // Token expires in 60 minutes
    return { status: 200, user: response.data.user };
  } catch (error) {
    console.error('Sign Up Error:', error.response?.data || error.message);
    return error.response?.data || { error: 'An error occurred during sign up' };
  }
};

export const signIn = async (user) => {
  try {
    const response = await axios.post(`${requestAddress}/api/auth/signin`, user);
    setTokenWithExpiry('token', response.data.token, 60); // Token expires in 60 minutes
    return { status: 200, user: response.data.user };
  } catch (error) {
    console.error('Sign In Error:', error.response?.data || error.message);
    return { status: 500, msg: error.response.data.msg || 'An error occurred during sign in' };
  }
};

export const getUserData = async () => {
  try {
    const token = getTokenWithExpiry('token');

    if (!token) {
      throw new Error('Token expired or not found');
    }

    const response = await axiosApi.get('/auth/getuserdata', {
      headers: { Authorization: `Bearer ${token}` },
    });

    setTokenWithExpiry('token', response.data.token, 60); // Refresh token expiry time
    return response.data; // Return user data instead of just a status code
  } catch (error) {
    console.error('Get User Data Error:', error.response?.data || error.message);
    return error.response?.data || { error: 'An error occurred while fetching user data' };
  }
};
