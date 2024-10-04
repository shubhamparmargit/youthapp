import axios from 'axios';
const config = require('../utils/config');
const user = (JSON.parse(localStorage && localStorage.getItem('user')))

const userActionService = {

  getUserInfo: async (userId) => {
    try {
      if(userId){
        const response = await axios.post(`${config.baseUrl}/users/userInfo`, ({ userId: userId }));
        return response.data;
      }
    } catch (error) {
      console.error("Error fetching User Info:", error);
      throw error;
    }
  },

  findFriends: async (searchQuery) => {
    try {
      const response = await axios.post(`${config.baseUrl}/users/findFriends`, ({ searchQuery: searchQuery, userId: user._id }));
      return response.data;
    } catch (error) {
      console.error("Error fetching User Info:", error);
      throw error;
    }
  },

  editProfile: async (formData) => {
    const response = await axios.post(`${config.baseUrl}/editProfile`, formData);
    return response.data
  },

  fillInfo: async (formData) => {
    const response = await axios.post(`${config.baseUrl}/fillInfo`, formData);
    return response.data
  },

  followUnfollow: async (currentUser1, userId1) => {
    const currentUser = currentUser1._id;
    const userId = userId1._id;
    const response = await axios.post(`${config.baseUrl}/users/follow`, {
      currentUser: currentUser,
      userId: userId

    });
    return response.data
  },

  getAllUser: async (userId) => {
    try {
      const response = await axios.post(`${config.baseUrl}/userList`);
      return response.data;
    } catch (error) {
      console.error("Error fetching User Info:", error);
      throw error;
    }
  },

  blockUnblockUser: async (currentUser1, userId1) => {
    const currentUser = currentUser1._id;
    const userId = userId1._id;
    const response = await axios.post(`${config.baseUrl}/blockUnblockUser`, {
      loggedUser: currentUser,
      userId: userId,
      senderName:currentUser1.username,
      receiverName:userId1.username
    });
    return response.data
  },

 checkUsername : async (username) => {
  const response = await axios.post(`${config.baseUrl}/checkUsername`, null, {
    params: { username }
  });
  return response.data;
},

contactUs : async (formData) => {
  const response = await axios.post(`${config.baseUrl}/contactUs`, {
    formData
  });
  return response.data;
},

userdashoboard : async () => {
  const response = await axios.get(`${config.baseUrl}/userdashoboard`);
  return response.data;
}


};

export default userActionService;
