import React from 'react';
import BottomNav from '../../fotter/bottomNavigation.js';
import QuestionDetails from './QuestionDetails.js';
import QuestionDetailsTopBar from './TopBar.js';


function QuestionDetailsRoute() {
  
  return (
    <div>
      <QuestionDetailsTopBar />
      <QuestionDetails/>
    </div>
  )
}

export default QuestionDetailsRoute


