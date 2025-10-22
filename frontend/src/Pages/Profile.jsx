import React, { useContext } from 'react'
import { AuthContext } from '../Context/AuthProvider'

const Profile = () => {
    const { user,userData,loading } = useContext(AuthContext);

    if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#121826]">
        <div className="loader animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  console.log(userData);

  console.log(user);
  


  

  return (
    <div>
      
    </div>
  )
}

export default Profile
