import React from 'react'
import { Chip } from '@material-tailwind/react'

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
      <div>
      
      <div variant="ghost" className='flex place-items-center bg-blue-gray-50 rounded-full px-3 py-1 text-xs gap-1'>{user.username}
        <svg onClick={handleFunction} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </div>

    </div>
  )
}

export default UserBadgeItem
