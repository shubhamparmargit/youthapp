import axios from 'axios';
const { baseUrl } = require('../utils/config.js')

const authService = {
  login: async (formData) => {
    const response = await axios.post(`${baseUrl}/api/auth/login`, formData);
    return response.data;
  },
  signup: async (formData) => {
    const response = await axios.post(`${baseUrl}/api/auth/signup`, formData);
    return response.data;
  },
  googleUserLogin: async (formData) => {
    const response = await axios.post(`${baseUrl}/api/auth/sociallogin`, formData);
    return response.data;
  },
};

export default authService;


// src/services/authService.js


