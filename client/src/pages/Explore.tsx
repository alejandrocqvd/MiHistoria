import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

export const Explore = () => {
  const [searchStories, setSearchStories] = useState<boolean>(false)
  const [searchUsers, setSearchUsers] = useState<boolean>(false)

  const getSearchTitle = () => {
    if (searchStories) return 'Search Stories'
    if (searchUsers) return 'Search Users'
    return 'Search'
  }

  return (
    <>
      <div className='flex flex-col justify-center items-center h-auto w-9/12 mb-24 mt-32'>

        <div className='flex flex-col w-full md:w-5/12'>
          <h1 className='text-center mb-12 font-bold text-4xl'>{getSearchTitle()}</h1>

          <div className='w-full relative'>
            <input type='text' placeholder='Search titles or usernames...' className='w-full rounded-xl py-4 md:py-3 px-6 bg-secondary shadow-lg'></input>
            <button className='absolute inset-y-0 right-0 px-6 flex items-center text-sm'>
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>

          <div className='flex flex-row justify-stretch items-center'>
            <button 
              className={ searchStories ? 'bg-secondary mx-auto mt-4' : 'mx-auto mt-4' } 
              onClick={() => { setSearchStories(!searchStories); setSearchUsers(false); }}>Stories
            </button>
            <button 
              className={ searchUsers ? 'bg-secondary mx-auto mt-4' : 'mx-auto mt-4' } 
              onClick={() => { setSearchUsers(!searchUsers); setSearchStories(false); }}>Users
            </button>
          </div>

        </div>

      </div>
    </>
  )
}

export default Explore
