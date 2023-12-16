import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import homeBg from '../assets/home-bg.png'

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

        <div className='flex flex-col w-full md:w-1/2'>
          <h1 className='text-center mb-12 font-bold text-5xl bg-clip-text text-transparent bg-gradient'>{getSearchTitle()}</h1>

          <div className='w-full relative'>
            <input type='text' placeholder='Search...' className='w-full rounded-xl py-4 md:py-3 px-6 bg-secondary shadow-lg'></input>
            <button className='absolute inset-y-0 right-0 px-6 flex items-center text-sm'>
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>

          <div className='flex flex-row justify-center items-center mb-12'>
            <button 
              className={ searchStories ? 'bg-secondary w-1/2 my-3 pt-1 pb-2 rounded-xl shadow-md' : 'w-1/2 my-3  pt-1 pb-2' } 
              onClick={() => { setSearchStories(!searchStories); setSearchUsers(false); }}>Stories
            </button>
            <button 
              className={ searchUsers ? 'bg-secondary w-1/2 my-3 pt-1 pb-2 rounded-xl shadow-md' : 'w-1/2 my-3 pt-1 pb-2' } 
              onClick={() => { setSearchUsers(!searchUsers); setSearchStories(false); }}>Users
            </button>
          </div>

          <div>
            <button 
              className={ searchStories ? 'bg-secondary w-1/2 my-3 pt-1 pb-2 rounded-xl shadow-md' : 'w-1/2 my-3  pt-1 pb-2' } 
              onClick={() => { setSearchStories(!searchStories); setSearchUsers(false); }}>Stories
            </button>
          </div>
          
          <div className='flex flex-col justify-center items-center'>
            <a href='./story/:id' className='flex flex-row justify-between items-center w-full mb-4 px-6 py-3 bg-secondary rounded-xl hover:shadow-lg hover:scale-105 transition duration-300 ease-in-out'>
              <div className='flex flex-row justify-center items-center overflow-hidden'>
                <img src={homeBg} className='h-16 w-auto rounded-xl mr-6' />
                <h1 className='text-xl font-semibold overflow-hidden text-ellipsis line-clamp-1'>Once Upon A Time In Hollywood</h1>
              </div>
              <p className='flex-shrink-0'>John Seed</p>
            </a>

            <a href='./story/:id' className='flex flex-row justify-between items-center w-full mb-4 px-6 py-3 bg-secondary rounded-xl hover:shadow-lg hover:scale-105 transition duration-300 ease-in-out'>
              <div className='flex flex-row justify-center items-center overflow-hidden'>
                <img src={homeBg} className='h-16 w-auto rounded-xl mr-6' />
                <h1 className='text-xl font-semibold overflow-hidden text-ellipsis line-clamp-1'>JohnSeed1</h1>
              </div>
              <p className='flex-shrink-0'>John Seed</p>
            </a>
          </div>

        </div>

      </div>
    </>
  )
}

export default Explore
