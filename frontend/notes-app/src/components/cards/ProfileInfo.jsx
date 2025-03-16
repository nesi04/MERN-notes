import React from 'react'
import { getInitials } from '../../utils/helper'

const ProfileInfo = ({onLogout,userInfo}) => {
  return (
    <div className="flex items-center gap-3">
        <div className="size-12 flex items-center justify-center rounded-full text-accent font-medium bg-base-100">
            {getInitials(userInfo?.fullName)}
        </div>
        <div className="">
            <p className='text-sm font-medium text-accent'>{userInfo?.fullName}</p>
            <button className='text-sm underline ' onClick={onLogout}>Log Out</button>
        </div>
    </div>
  )
}

export default ProfileInfo