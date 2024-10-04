import axios from 'axios';
const config = require('../utils/config');
const loggedUser = (JSON.parse(localStorage && localStorage.getItem('user')))

const questionService = {

  getQuestions: async (createdBy) => {
    try {
      const response = await axios.get(`${config.baseUrl}/api/questions`, {
        params: { createdBy }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching questions:", error);
      throw error;
    }
  },

  getAllQuestions: async () => {
    try {
      if (loggedUser == null) {
        const response = await axios.get(`${config.baseUrl}/api`);
        return response.data;
      } else {
        const response = await axios.get(`${config.baseUrl}/api`, { userId: loggedUser._id });
        return response.data;
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      throw error;
    }
  },

  getAllQuestionsLookUp: async () => {
    try {

      const response = await axios.get(`${config.baseUrl}/api`);
      return response.data;
    } catch (error) {
      console.error("Error fetching questions:", error);
      throw error;
    }
  },

  createQuestion: async (formData) => {
    const response = await axios.post(`${config.baseUrl}/api/questions`, formData);
    return response.data
  },

  likeQuestion: async (formData, user) => {
    const postId = formData._id
    const createdBy = user._id
    const response = await axios.post(`${config.baseUrl}/api?postId=${postId}`, {
      createdBy: createdBy,
      postInfo: formData,
      senderInfo: user,
      type: "like"

    });
    return response.data
  },

  commentPost: async (formData, user) => {
    const postId = formData.postId;
    const response = await axios.post(`${config.baseUrl}/api/commentPost?postId=${postId}`, {
      content: formData.content,
      userId: formData.user._id,
      postInfo: formData.postInfo,
      senderInfo: user,
      type: "comment"

    });
    return response.data
  },

  replyPost: async (formData, user) => {
    const userId = (formData.user)._id;
    const postId = formData.postId;
    const commentWritter = formData.commentWritter;
    const content = formData.content;
    const commentId = formData.commentId;
    const response = await axios.post(`${config.baseUrl}/api/replyComment`, {
      content: content,
      userId: userId,
      commentId: commentId,
      postId: postId,
      commentWritter: commentWritter
      // userId:formData.user._id
    });
    return response.data
  },

  likeComment: async (values, user, post) => {
    const userId = user._id;
    const postId = post._id;
    const commentId = values._id;
    
    const response = await axios.post(`${config.baseUrl}/api/likeComment`, {
      userId: userId,
      commentId: commentId,
      postId: postId
    });
    return response.data
  },

  updateComment: async (values, user) => {
    const content = values.content;
    const postId = values.postId;
    const commentId = values.commentId;

    const response = await axios.post(`${config.baseUrl}/api/updateComment`, {
      content: content,
      commentId: commentId,
      postId: postId
    });
    return response.data
  },

  reportcomment: async (commentId, postId, userId) => {
    const response = await axios.post(`${config.baseUrl}/api/questions/reportcomment`, {
      commentId: commentId,
      postId: postId,
      userId:userId
    });
    return response.data
  },

  deletecomment: async (commentId,postId) => {
    const response = await axios.post(`${config.baseUrl}/api/questions/deletecomment`, {
      commentId: commentId,
      postId: postId,
    });
    return response.data
  },

  reportreply: async (commentId,postId,replyId,userId) => {
    const response = await axios.post(`${config.baseUrl}/api/questions/reportreply`, {
      commentId: commentId,
      postId: postId,
      replyId:replyId,
      userId:userId
    });
    return response.data
  },

  deletereply: async (commentId,postId,replyId) => {
    const response = await axios.post(`${config.baseUrl}/api/questions/deletereply`, {
      commentId: commentId,
      postId: postId,
      replyId:replyId
    });
    return response.data
  },

  deleteCommnet: async (values, user) => {
    const content = values.content;
    const postId = values.postId;
    const commentId = values.commentId;

    const response = await axios.post(`${config.baseUrl}/api/deleteCommnet`, {
      commentId: commentId,
      postId: postId
    });
    return response.data
  },
  
  notification: async (values) => {
    const response = await axios.post(`${config.baseUrl}/api/notification`, {
      userId:  values._id
    });
    return response.data;
  },

  getCommentAllReply: async (values) => {
    try {
      const commentId = values.commentId;
      const postId = values._id;
      const response = await axios.get(`${config.baseUrl}/api/getCommentAllReply`, {
        commentId: commentId,
        postId: postId
      });
      return response.data;

    } catch (err) {
      console.error(err)

    }

  },

  getPostInfo: async (postId) => {
    try {
      const response = await axios.post(`${config.baseUrl}/api/questions/postInfo`, { postId: postId });
      return response.data;
    } catch (error) {
      console.error("Error fetching questions:", error);
      throw error;
    }
  },

  forYouList: async (userId) => {
    try {
      const response = await axios.post(`${config.baseUrl}/api/questions/foryou`, { userId: userId });
      return response.data;
    } catch (error) {
      console.error("Error fetching list:", error);
      throw error;
    }
  },

  share: async (postId) => {
    try {
      if(loggedUser !=""){
        const response = await axios.post(`${config.baseUrl}/api/questions/share`, { postId: postId, userId: loggedUser._id });
        return response.data;
      }else{
        return
      }

    } catch (error) {
      console.error("Error fetching share:", error);
      throw error;
    }
  },

  getQuestionDetailsInfo: async (postId) => {
    try {
      const response = await axios.post(`${config.baseUrl}/api/getPostsInfomations`, { postId: postId });
      return response.data;
    } catch (error) {
      console.error("Error fetching question:", error);
      throw error;
    }
  },

  deletePost: async (id) => {
    try {
      const response = await axios.delete(`${config.baseUrl}/api/questions/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting questions:", error);
      throw error;
    }
  },

  deletePostAndQuestions : async (id) => {
    try {
      const response = await axios.post(`${config.baseUrl}/api/questions/deletePostQuestions`,{
        postId:id
      });
      return response.data;
      
    } catch (error) {
      console.error("Error deleting questions:", error);
      throw error;
    }
  },

  reportQuestions: async (postId, userId) => {
    try {
      const response = await axios.post(`${config.baseUrl}/api/questions/reportquestion/${postId}`,{userId:userId});
      return response.data;
    } catch (error) {
      console.error("Error reporting questions/post:", error);
      throw error;
    }
  }

};

export default questionService;
