import React from 'react'

export const Home = () => {
  return (
    <>
      <div className='flex justify-center items-center h-screen'>
        <div className='text-7xl font-bold text-center'>
          <h1 className='my-10 py-10 bg-clip-text text-transparent bg-gradient'>Speak your mind.</h1>
          <h1 className='my-10 py-10 bg-clip-text text-transparent bg-gradient'>Tell your truth.</h1>
          <h1 className='my-10 py-10 bg-clip-text text-transparent bg-gradient'>Write your story, <span className='underline'>here.</span></h1>
        </div>
      </div>
    </>
  )
}

export default Home
