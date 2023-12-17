import React, { useState } from 'react'
import storyBg from '../../assets/login-bg.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart as solidHeart, faBookmark as solidBookmark, faShareAlt, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart, faBookmark as regularBookmark } from '@fortawesome/free-regular-svg-icons';
import { Outlet } from 'react-router-dom';

const Story = () => {
  // States and functions for liking and saving the story
  const [liked, setLiked] = useState<Boolean>(false)
  const [saved, setSaved] = useState<Boolean>(false)

  const handleLike = () => {
    setLiked(!liked)
  }
  const handleSave = () => {
    setSaved(!saved)
  }

  return (
    <div className='flex flex-col justify-center items-center mt-20 w-9/12'>

      <div className='flex flex-col h-auto w-full md:w-1/2'>

        <h1 className='text-4xl text-center font-bold my-6'>Username</h1>
        <div className='flex-1 flex flex-row justify-center items-center rounded-xl mb-6'>
          <img src={storyBg} className='h-16 rounded-xl w-16' />
          <h2 className='text-2xl ml-8 font-semibold'>First Name Last Name</h2>
          <h2 className='text-2xl ml-8 font-normal'>65 Years Old</h2>
        </div>

        <img src={storyBg} className='h-72 w-full rounded-xl mb-6' />
        <h1 className='text-4xl text-center font-bold mb-6'>Title</h1>

        <div className='flex flex-row justify-center items-center mb-6'>
          <button onClick={handleLike} className={`text-center rounded-xl bg-secondary px-4 py-2 ${ liked ? 'text-red-600' : null}`}>
            <FontAwesomeIcon icon={liked ? solidHeart : regularHeart} className='mr-1' /> 24k
          </button>
          <button onClick={handleSave} className={`mx-4 text-center rounded-xl bg-secondary px-4 py-2 ${ saved ? 'text-amber-500' : null}`}>
            <FontAwesomeIcon icon={saved ? solidBookmark : regularBookmark} className='mr-1' /> 6k
          </button>
          <button className='text-center rounded-xl bg-secondary px-4 py-2'>
            <FontAwesomeIcon icon={faShareAlt} className='mr-1' /> Share
          </button>
        </div>
        
      </div>

      <Outlet />

      <div className='flex flex-col justify-center items center w-1/2 mb-6'>
        <h1 className='text-2xl font-semibold mb-6'>Comments</h1>
        <div className='pb-4 relative mb-4'>
          <input className='w-full py-2 px-4 pl-3 pr-10 rounded-2xl bg-tertiary' type='textarea' placeholder='Comment...' required></input>
          <button className='absolute inset-y-0 right-0 px-5 pt-3 flex items-center text-sm'>
            <FontAwesomeIcon className='absolute inset-y-0 right-0 px-5 pt-3 flex items-center text-sm' icon={faPaperPlane} />
          </button>
        </div>

        <div className='flex flex-col justify-items-center bg-secondary rounded-xl p-4 mb-2'>
          <div className='flex flex-row justify-between items-center'>
            <div className='flex flex-row justify-start items-center mb-2'>
              <img src={storyBg} className='h-8 rounded-xl w-8' />
              <a href={'./story/:id'} className='text-lg ml-4 font-semibold'>First Name Last Name</a>
            </div>
            <p>Date and Time</p>
          </div>
          <p className='px-2'>Comment that comments on the post!</p>
        </div>

      </div>

    </div>
  )
}

export default Story
