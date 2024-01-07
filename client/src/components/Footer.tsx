/**
 * Footer Component
 * 
 * This component renders the application's footer. Contains links to the home/landing, 
 * about, help, and legal page.
 * 
 * Author: Alejandro Cardona
 * Date: 2024-01-06
 */

import { Link } from "react-router-dom"

export const Footer = () => {
  return (
    <>
      <div className='flex flex-col justify-center items-center bottom-0 h-auto w-screen m-0 p-24 bg-secondary'>
        <div className='flex flex-col md:flex-row md:justify-between w-full md:w-9/12 items-start p-4'>
          <div className='flex-1 flex flex-col text-center md:text-left'>
            <h1 className='font-bold text-xl'>Discover MiHistoria</h1>
            <p>Take time to look back, reflect, and write your story. Explore our features and the broad collection of stories.</p>
          </div>
          <div className='flex-1 flex flex-col text-center md:text-left mx-0 my-8 md:my-0 md:mx-8'>
            <h1 className='font-bold text-xl'>Explore Stories</h1>
            <p>Check our top stories or search for a story that intrigues you. Like, share, save, and comment on your favorites.</p>
          </div>
          <div className='flex-1 flex flex-col text-center md:text-left'>
            <h1 className='font-bold text-xl'>Get Inspired</h1>
            <p>Check our help page to assist you in getting started on your story writing journey.</p>
          </div>
        </div>
        <hr className='bg-white h-1/2 w-full md:w-9/12 my-8'></hr>
        <div className='flex flex-col md:flex-row justify-between w-9/12 items-center p-4'>
          <div>
            <Link to='./'><h2 className='text-3xl font-notable font-extrabold mb-16 md:mb-0'>MiHistoria</h2></Link>
          </div>
          <div className='flex flex-grow justify-end items-center font-bold'>
            <Link className='hover-underline-animation' to='./'>About</Link>
            <Link className='hover-underline-animation mx-24' to='./help'>Help</Link>
            <Link className='hover-underline-animation' to='./legal'>Legal</Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Footer
