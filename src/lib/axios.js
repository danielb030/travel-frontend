import axios from 'axios';
import Cookies from 'js-cookie';

export const axiosApi = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

axiosApi.interceptors.request.use(
  (config) => {
    // Retrieve the token from cookies
    const token = Cookies.get('token');

    if (token) config.headers.Authorization = `${token}`;

    return config;
  },
  (error) => Promise.reject(error)
);
