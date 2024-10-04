import React, { useEffect, useState } from "react";
import TopBar from '../TopBar';
import PostQuestion from '../Questions/PostQuestion';
import BottomNav from '../../fotter/bottomNavigation';
import questionService from '../../services/questionService';

function Home() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const data = await questionService.getAllQuestions();
      setQuestions(data);
    } catch (error) {
      console.error("Error fetching questions: ", error);
    }
  };

  return (
    <div>
      <TopBar />
      <PostQuestion />
      <BottomNav />
    </div>
  );
}

export default Home;
