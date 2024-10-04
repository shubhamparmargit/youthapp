import React from 'react';
import Profile from './Profile';
import ProfileTopBarPage from './ProfileTopBar';
import BottomNavProfile from './ProfileBottomBar';

function ProfileRoute() {
  
  return (
    <div>
      <ProfileTopBarPage/>
      <Profile/>
      <BottomNavProfile />
    </div>
  )
}

export default ProfileRoute


