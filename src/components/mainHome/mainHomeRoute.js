import React from 'react';
import TopBar from '../TopBar';
import Main from './main';
import BottomNav from '../../fotter/bottomNavigation';

function MainHomeRoute() {
  
  return (
    <div>
      <TopBar/>
      <Main/>
      <BottomNav />
    </div>
  )
}

export default MainHomeRoute


