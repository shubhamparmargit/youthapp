import React from 'react';
import TopBar from '../TopBar.js';
import BottomNav from '../../fotter/bottomNavigation.js';
import MyQuestion from './Question.js';


function QuestionRoute() {
  
  return (
    <div>
      <TopBar/>
      <MyQuestion/>
      <BottomNav />
    </div>
  )
}

export default QuestionRoute


