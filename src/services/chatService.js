import axios from 'axios';
const { baseUrl } = require('../utils/config')

const chatService = {


  getChatData: async (user, otherUser) => {
    try {
      const response = await axios.get(`${baseUrl}/api/chat`, {
        params: {
          sender: user.username,
          receiver: otherUser.username,
          userId: user._id,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  

  getMyChatData: async (user) => {
    try {
      const response = await axios.post(`${baseUrl}/api/mychat`, { sender: user });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  chatsSeen: async (data) => {
    try {
      const response = await axios.post(`${baseUrl}/api/chatsSeen`, { sender: data.sender, receiver: data.receiver, seenStatus: true });
      return response.data;
    } catch (error) {
      console.error("Error fetching seen chats:", error);
      throw error;
    }
  },

  deleteMessage: async (data) => {
    try {
      const response = await axios.post(`${baseUrl}/api/deleteMessage`, { messageId: data.messageId});
      return response.data;
    } catch (error) {
      console.error("Error deleting message:", error);
      throw error;
    }
  },

  deleteChat: async (data) => {
    try {
      const response = await axios.post(`${baseUrl}/api/deleteChat`, { sender: data.sender, receiver: data.receiver, loginId: data.loginId});
      return response.data;
    } catch (error) {
      console.error("Error deleting message:", error);
      throw error;
    }
  },

  editMessage: async (data) => {
    try {
      const response = await axios.post(`${baseUrl}/api/editMessage`, { messageId: data.messageId, message: data.message, edited: "true"});
      return response.data;      
    } catch (error) {
    }
  }

}

export default chatService;