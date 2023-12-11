import { useState } from 'react'
import { Link } from 'react-router-dom'

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <nav className='flex fixed justify-between items-center h-16 w-full top-0 px-12 py-10 backdrop-blur-md bg-opacity-50 bg-secondary'>
        <div>
          <Link to='./'><h2 className='text-3xl px-4 font-notable font-extrabold bg-clip-text text-transparent bg-gradient'>MiHistoria</h2></Link>
        </div>
        <div className='hidden md:flex flex-grow justify-center items-center'>
          <Link className='hover-underline-animation m-14' to='./'>Home</Link>
          <Link className='hover-underline-animation m-14' to='./explore'>Explore</Link>
          <Link className='hover-underline-animation m-14' to='./story:id'>Your Story</Link>
        </div>
        <div className="hidden md:flex justify-center items-center h-10 w-24 ml-32 p-4 bg-gradient rounded-xl shadow-lg font-bold transition duration-200 ease-in-out hover:scale-105">
          <Link to='./login'>Login</Link>
        </div>
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
      </nav>
      <div className={`absolute top-20 w-full bg-secondary md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <Link className='block p-4 hover:bg-tertiary hover:font-semibold' to='./'>Home</Link>
        <Link className='block p-4 hover:bg-tertiary hover:font-semibold' to='./explore'>Explore</Link>
        <Link className='block p-4 hover:bg-tertiary hover:font-semibold' to='./story:id'>Your Story</Link>
        <Link className='block p-4 hover:bg-tertiary hover:font-semibold' to='./login'>Login</Link>
      </div>
    </>
  )
}

export default Navbar
