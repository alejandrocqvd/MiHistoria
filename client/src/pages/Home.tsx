import React, { useState } from 'react'
import homeBg from '../assets/home-bg.png'
import { Link } from 'react-router-dom'
import globeIcon from '../assets/globe-icon.png'
import bookIcon from '../assets/book-icon.png'
import privacyIcon from '../assets/privacy-icon.png'

export const Home = () => {
  const [currentUser, setCurrentUser] = useState(false)

  return (
    <>
      <div className='flex justify-center md:justify-between items-center h-screen w-9/12 mb-24'>
        <div className='text-6xl font-bold text-center md:text-left'>
          <h1 className='my-10 py-5'>Speak your mind.</h1>
          <h1 className='my-10 py-5'>Tell your truth.</h1>
          <h1 className='my-10 py-5'>Write your story, <span className=' bg-clip-text text-transparent bg-gradient font-extrabold underline'>here.</span></h1>
          <div className='flex flex-row justify-start items-center'>
            <button className='hidden md:flex justify-center items-center h-10 w-auto p-4 mr-8 bg-gradient text-sm rounded-xl shadow-lg font-bold transition duration-200 ease-in-out hover:scale-105'>
              <Link to='./register'>Start your journey</Link>
            </button>
            <button className='hidden md:flex justify-center items-center h-10 w-auto p-4 text-sm border-2 rounded-xl shadow-lg font-bold transition duration-200 ease-in-out hover:scale-105'>
              { currentUser ? <Link to='./story:id'>Continue your story</Link> : <Link to='./login'>Continue your story</Link>}
            </button>
          </div>
        </div>
        <div>
          <img src={homeBg} className='hidden md:flex' />
        </div>
      </div>

      <div className='flex flex-col justify-center items-center w-9/12 py-16 md:px-48 px-8 bg-[#292929] shadow-xl rounded-xl'>
        <h1 className='text-5xl font-bold mb-12 text-center'>What is MiHistoria?</h1>
        <p className='text-xl flex-1 mr-6 text-center'>
          In an digital world full of fleeting moments and endless posts, MiHistoria offers something different. 
          Here, each user gets one chance, <span className='font-bold'>one post, to share their life story.</span> Our app is built on the belief that every person's 
          journey is unique and deserves to be told in its entirety. We've created this space to allow users to look back, reflect, and write down their lives.
        </p>
      </div>
      <div className='flex flex-col justify-center items-center w-9/12 mt-10 mb-24 py-16 md:px-48 px-8 bg-[#292929] shadow-xl rounded-xl'>
        <p className='text-xl mb-24 text-center'>
          We invite you to join this community and share your story, your entire story, in one post. Or delve into the intricate and beautiful 
          lives of others, learning, emphasizing, and connecting in a way that transcends traditional social media boundaries.
        </p>
        <h1 className='text-4xl font-extralight pb-2 text-center italic'>"There is no greater agony than bearing the untold story inside you"</h1>
        <h1 className='text-2xl font-semibold mt-6 text-center'>- Maya Angelou</h1>
      </div>

      <h1 className='text-5xl font-bold mb-16 mt-28'>What To Do</h1>
      <div className='flex flex-col lg:flex-row justify-stretch items-stretch w-9/12 mb-24'>
        <a href={'./explore'} 
          className='flex-1 flex flex-col justify-between items-center w-full p-16 mb-8 text-center bg-[#292929] shadow-xl rounded-xl hover:shadow-2xl hover:scale-105 transition duration-300 ease-in-out'>
            <h1 className='text-4xl font-semibold mb-8'>Read Human Experiences</h1>
            <img src={globeIcon} className='h-24 w-auto mb-8' />
            <p>See the collection of personal narratives that take you though the intricate experiences of people from any corner of the world.</p>
        </a>
        <a href={'./story/:id'} className='flex-1 flex flex-col justify-between items-center w-full lg:mx-20 p-16 mb-8 text-center bg-[#292929] shadow-xl hover:shadow-2xl rounded-xl hover:scale-105 transition duration-300 ease-in-out'>
            <h1 className='text-4xl font-semibold mb-8'>Write <span className='underline'>Your</span> Story</h1>
            <img src={bookIcon} className='h-24 w-auto mb-8' />
            <p>Let the world hear your story. Travel back in your time to recollect and write down your life.</p>
        </a>
        <a href={'./profile/:id/settings'} className='flex-1 flex flex-col justify-between items-center w-full p-16 mb-8 text-center bg-[#292929] shadow-xl hover:shadow-2xl rounded-xl hover:scale-105 transition duration-300 ease-in-out'>
            <h1 className='text-4xl font-semibold mb-8'>Be yourself or be anonymous</h1>
            <img src={privacyIcon} className='h-24 w-auto mb-8' />
            <p>No need to expose your identity, feel free to write anonymously and tell your truth with no filter.</p>
        </a>
      </div>

      <h1 className='text-5xl font-bold mb-16 mt-28'>Our Top Stories</h1>
      <div className='flex flex-col justify-center items-stretch h-auto w-9/12 mb-32'>
        
        <a href='./story/:id' className='flex flex-row justify-center items-center mb-4 h-24 p-8 bg-[#292929] shadow-xl rounded-xl hover:shadow-2xl hover:scale-105 transition duration-300 ease-in-out'>
          <div className='flex-1 flex flex-col justify-items-center h-full'>
            <h1 className='text-3xl text-center'>Title</h1>
          </div>
          <div className='flex-1 flex flex-row justify-center items-center rounded-xl'>
            <img src={homeBg} className='h-20' />
            <h2 className='text-xl ml-8'>Author</h2>
          </div>
        </a>

        <a href='./story/:id' className='flex flex-row justify-center items-center mb-4 h-24 p-8 bg-[#292929] shadow-xl rounded-xl hover:shadow-2xl hover:scale-105 transition duration-300 ease-in-out'>
          <div className='flex-1 flex flex-col justify-items-center h-full'>
            <h1 className='text-3xl text-center'>Title</h1>
          </div>
          <div className='flex-1 flex flex-row justify-center items-center rounded-xl'>
            <img src={homeBg} className='h-20' />
            <h2 className='text-xl ml-8'>Author</h2>
          </div>
        </a>

        <a href='./story/:id' className='flex flex-row justify-center items-center mb-4 h-24 p-8 bg-[#292929] shadow-xl rounded-xl hover:shadow-2xl hover:scale-105 transition duration-300 ease-in-out'>
          <div className='flex-1 flex flex-col justify-items-center h-full'>
            <h1 className='text-3xl text-center'>Title</h1>
          </div>
          <div className='flex-1 flex flex-row justify-center items-center rounded-xl'>
            <img src={homeBg} className='h-20' />
            <h2 className='text-xl ml-8'>Author</h2>
          </div>
        </a>

        <a href='./story/:id' className='flex flex-row justify-center items-center mb-4 h-24 p-8 bg-[#292929] shadow-xl rounded-xl hover:shadow-2xl hover:scale-105 transition duration-300 ease-in-out'>
          <div className='flex-1 flex flex-col justify-items-center h-full'>
            <h1 className='text-3xl text-center'>Title</h1>
          </div>
          <div className='flex-1 flex flex-row justify-center items-center rounded-xl'>
            <img src={homeBg} className='h-20' />
            <h2 className='text-xl ml-8'>Author</h2>
          </div>
        </a>

        <a href='./story/:id' className='flex flex-row justify-center items-center mb-4 h-24 p-8 bg-[#292929] shadow-xl rounded-xl hover:shadow-2xl hover:scale-105 transition duration-300 ease-in-out'>
          <div className='flex-1 flex flex-col justify-items-center h-full'>
            <h1 className='text-3xl text-center'>Title</h1>
          </div>
          <div className='flex-1 flex flex-row justify-center items-center rounded-xl'>
            <img src={homeBg} className='h-20' />
            <h2 className='text-xl ml-8'>Author</h2>
          </div>
        </a>

      </div>
    </>
  )
}

export default Home
