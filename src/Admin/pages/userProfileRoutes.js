import React, { useState } from 'react';

import UserProfile from '../../Admin/pages/userProfile'
import UserProfileTopBarPage from './userProfileTopBar';

function UserProfileRoute() {
  const [userData, setUserData] = useState(null);
  return (
    <div>
      <UserProfileTopBarPage userData={userData} />
      <UserProfile setUserData={setUserData} />
    </div>
  )
}

export default UserProfileRoute


