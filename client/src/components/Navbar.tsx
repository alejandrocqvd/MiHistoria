import React from 'react'
import { Link } from 'react-router-dom'

export const Navbar = () => {
  return (
    <>
      <nav className='flex fixed justify-between items-center h-16 w-full top-0 px-12 py-10 backdrop-blur-md bg-opacity-50 bg-secondary'>
        <div>
          <Link to={'./'}><h2 className='text-3xl px-4 font-notable font-extrabold bg-clip-text text-transparent bg-text-gradient'>MiHistoria</h2></Link>
        </div>
        <div className='flex flex-grow justify-center items-center'>
          <Link className='hover-underline-animation m-14' to={'./'}>Home</Link>
          <Link className='hover-underline-animation m-14' to={'./explore'}>Explore</Link>
          <Link className='hover-underline-animation m-14' to={'./story:id'}>Your Story</Link>
        </div>
        <div className="flex justify-center items-center h-10 w-24 ml-32 p-4 bg-important rounded-xl font-bold">
          <Link to={'./login'}>Login</Link>
        </div>
      </nav>
    </>
  )
}

export default Navbar
