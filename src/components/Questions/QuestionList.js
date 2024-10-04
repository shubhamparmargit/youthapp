import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import questionService from '../../services/questionService';

function QuestionList() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await questionService.getQuestions();
        setQuestions(data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    }
    fetchData();
  }, []);
 
  return (
    <div>
      <h2>Questions</h2>
      <ul>
        {questions.map(question => (
          <li key={question._id}>
            <Link to={`/questions/${question._id}`}>{question.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default QuestionList;
